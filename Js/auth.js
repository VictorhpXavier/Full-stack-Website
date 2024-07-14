const mysql = require('mysql');
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
router.use(cookieParser());

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
con.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* Get User info */
router.get('/get-user-id', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const id = decoded.id;
        res.json({ id });
    } catch (err) {
        return res.status(400).json({ error: 'Invalid Token' });
    }
});

router.get('/get-email', (req, res) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const email = decoded.email;
        res.json({ email, token });
    } catch (err) {
        return res.status(400).json({ error: 'Invalid Token' });
    }
});

//Handle Signup Logic
router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    
    let errors = [];
    const token = req.cookies.token;

    if(token) {
        errors.push({ error: 'ALREADY_LOGGED_IN', message: 'Already logged in' });
    }
    

    if (!password) {
        errors.push({ error: 'NO_PASSWORD', message: 'Please enter a password' });
        
    } else if (password.length < 8) {
        errors.push({ error: 'INVALID_PASSWORD', message: 'Password must be 8 characters or more' });
    }
    if (!email) {
        errors.push({ error: 'NO_EMAIL', message: 'Please enter an email' });
    } else if (!isValidEmail.test(email)) {
        errors.push({ error: 'INVALID_EMAIL', message: 'Please enter a valid email address' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const query = 'SELECT * FROM Users WHERE email = ?';
    con.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            errors.push({ error: 'EMAIL_ALREADY_EXISTS', message: 'Email already exists' });
            return res.status(400).json({ errors });
        } else {
            bcrypt.hash(password, 13, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to hash password' });
                }
                const insertQuery = 'INSERT INTO Users (email, password_hash) VALUES (?, ?)';
                con.query(insertQuery, [email, hash], (err) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to create user' });
                    }
                    const userId = results.insertId;
                    const token = jwt.sign({ userId, email }, secretKey, { expiresIn: '7d' });
                           
                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: 60 * 60 * 7 * 24 * 365 * 1000, // 1 year
                        secure: process.env.NODE_ENV === 'production', 
                    });
                    res.cookie('loggedIn', true, {
                        httpOnly: false, 
                        maxAge: 60 * 60 * 7 * 24 * 365 * 1000, // 1 year
                        secure: process.env.NODE_ENV === 'production',
                    })
                   
                    console.log('Secret Token:', token);
                    console.log('User created successfully');
                    return res.status(201).json({ message: 'User created successfully' });
                });
            });
        }
    });
});

//Handle Login Logic

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    let errors = [];
    const token = req.cookies.token;
    if(token) {
        errors.push({ error: 'ALREADY_LOGGED_IN', message: 'Already logged in' });
    }
    
    if (!password) {
        errors.push({ error: 'NO_PASSWORD', message: 'Please enter a password' });
    }
    if (!email) {
        errors.push({ error: 'NO_EMAIL', message: 'Please enter an email' });
    } else if (!isValidEmail.test(email)) {
        errors.push({ error: 'INVALID_EMAIL', message: 'Please enter a valid email address' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const query = 'SELECT * FROM Users WHERE email = ?';
    con.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            errors.push({ error: 'EMAIL_NOT_FOUND', message: 'Email not found' });
            return res.status(400).json({ errors });
        } else {
            const user = results[0];
            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
                }
                if (!isMatch) {
                    errors.push({ error: 'INVALID_PASSWORD', message: 'Wrong password. Try again or click Forgot password to reset it.' });
                    return res.status(400).json({ errors });
                }
                const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '7d' });
                
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 7 * 24 * 365 * 1000, // 1 year
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                });
                res.cookie('loggedIn', true, {
                    httpOnly: false, // Accessible by client-side JavaScript
                    maxAge: 60 * 60 * 7 * 24 * 365 * 1000, // 1 year
                    secure: process.env.NODE_ENV === 'production',
                })
                console.log('Secret Token:', token);

                console.log('User logged in successfully');
                return res.status(200).json({ message: 'User logged in successfully' });
            });
        }
    });
});

//Change Email logic
router.post('/Change-Email', (req, res) => {
    const { email, password } = req.body;
    const token = req.cookies.token;
    let errors = [];

    if (!email) {
        errors.push({ error: 'NO_NEW_EMAIL', message: 'Please enter a new email' });
    } else if (!isValidEmail.test(email)) {
        errors.push({ error: 'INVALID_EMAIL', message: 'Please enter a valid email address' });
    }

    if (!password) {
        errors.push({ error: 'NO_PASSWORD', message: 'Please enter your password' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        if (!token) {
            throw new Error('Token not provided');
        }

        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded);
        const emailToken = decoded.email;
        const userId = decoded.userId; // Assuming you are using userId in the token payload

        if (email === emailToken) {
            errors.push({ error: 'SAME_EMAIL', message: 'Can\'t update to the same email' });
            return res.status(400).json({ errors });
        }

        const verifyUserQuery = 'SELECT * FROM Users WHERE id = ?';
        con.query(verifyUserQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ errors: [{ error: 'INVALID_CREDENTIALS', message: 'Invalid password' }] });
            }

            const user = results[0];
            console.log('Retrieved user:', user);

            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
                }
                console.log('Password match:', isMatch); // Add this line for debugging

                if (!isMatch) {
                    console.log('Password mismatch');
                    return res.status(401).json({ errors: [{ error: 'INVALID_CREDENTIALS', message: 'Invalid password' }] });
                }

                const checkEmailQuery = 'SELECT * FROM Users WHERE email = ?';
                con.query(checkEmailQuery, [email], (err, emailResults) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
                    }

                    if (emailResults.length > 0) {
                        errors.push({ error: 'EMAIL_ALREADY_EXISTS', message: 'Email already exists' });
                        return res.status(400).json({ errors });
                    } else {
                        const updateQuery = 'UPDATE Users SET email = ? WHERE id = ?';
                        con.query(updateQuery, [email, userId], (err, result) => {
                             if (err) {
                                 console.error('Error updating email:', err);
                                 return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update email' });
                             }
                         
                             console.log('User email updated successfully');
                             // Assuming the email update was successful, you can return a response
                             res.status(200).json({ message: 'Email address updated successfully', email: email });
                        }); 
                    }
                });
            });
        });
    } catch (err) {
        console.error('Error verifying token:', err.message);
        res.status(401).json({ error: 'INVALID_TOKEN', message: 'Token is invalid or expired' });
    }
});

//Change Password logic

router.post('/Change-Password', (req, res) => {
    const { email, password, newpassword } = req.body;
    const token = req.cookies.token;
    let errors = [];

    if (!email) {
        errors.push({ error: 'NO_EMAIL', message: 'Please enter your email' });
    } else if (!isValidEmail.test(email)) {
        errors.push({ error: 'INVALID_EMAIL', message: 'Please enter a valid email address' });
    }

    if (!password) {
        errors.push({ error: 'NO_PASSWORD', message: 'Please enter your password' });
    } else if (!newpassword) {
        errors.push({ error: 'NO_NEW_PASSWORD', message: 'Please enter your new password' });
    } else if (newpassword.length < 8) {
        errors.push({ error: 'PASSWORD_SIZE', message: 'Password should have at least 8 characters' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        if (!token) {
            throw new Error('Token not provided');
        }

        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded);

        const userId = decoded.userId;

        if (password === newpassword) {
            errors.push({ error: 'SAME_PASSWORD', message: 'Can\'t update to the same password' });
            console.log('Cant update to the same password')
            return res.status(400).json({ errors });
        }
        const verifyUserQuery = 'SELECT * FROM Users WHERE id = ? AND email = ?';
        con.query(verifyUserQuery, [userId, email], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ errors: [{ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }] });
            }

            const user = results[0];
            console.log('Retrieved user:', user);

            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
                }
                console.log('Password match:', isMatch);

                if (!isMatch) {
                    return res.status(401).json({ errors: [{ error: 'INVALID_CREDENTIALS', message: 'Wrong password' }] });
                }

                bcrypt.hash(newpassword, 10, (err, newHashedPassword) => {
                    if (err) {
                        console.error('Error hashing new password:', err);
                        return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
                    }

                    const updateQuery = 'UPDATE Users SET password_hash = ? WHERE id = ?';
                    con.query(updateQuery, [newHashedPassword, userId], (err) => {
                        if (err) {
                            console.error('Error updating password:', err);
                            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update password' });
                        }

                        console.log('User password updated successfully');
                        return res.status(200).json({ message: 'Password updated successfully' });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Error verifying token:', err.message);
        res.status(401).json({ error: 'INVALID_TOKEN', message: 'Token is invalid or expired' });
    }
});
  
//Forgot Password logic not done, need to compare user password 
//with the hash, then if hash is the same ask user for new password

router.post('/forgotpassword', (req, res) => {
    const { email } = req.body;

    let errors = [];

    if (!email) {
        errors.push({ error: 'NO_EMAIL', message: 'Please enter an email' });
    } else if (!isValidEmail.test(email)) {
        errors.push({ error: 'INVALID_EMAIL', message: 'Please enter a valid email address' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const query = 'SELECT * FROM Users WHERE email = ?';
    con.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ errors: [{ error: 'SERVER_ERROR', message: 'Server error, please try again later' }] });
        }

        if (results.length === 0) {
            errors.push({ error: 'EMAIL_NOT_FOUND', message: 'Email not found' });
            return res.status(400).json({ errors });
        }

        res.status(200).json({ message: 'Password recovery email sent' });
    });
});


//Create token for darkmode
//Maybe I should put the darkMode preference on DB instead of cookies?
// Endpoint to get dark mode preference
router.get('/darkmode', (req, res) => {
    const darkMode = req.cookies.darkMode === 'true';
    res.json({ darkMode });
});

// Endpoint to set dark mode preference
router.post('/darkmode', (req, res) => {
    const { darkMode } = req.body;
    res.cookie('darkMode', darkMode, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
    res.sendStatus(200);
});

// Endpoint to clear dark mode preference
router.post('/cleardarkmode', (req, res) => {
    res.clearCookie('darkMode');
    res.sendStatus(200);
});


//Handle User profile pic
//* This creates the upload file
//Funciona
/*
const testUploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(testUploadDir)) {
    fs.mkdirSync(testUploadDir, { recursive: true });
    console.log(`Created directory: ${testUploadDir}`);
}

const testFilePath = path.join(testUploadDir, 'test.txt');
fs.writeFile(testFilePath, 'This is a test file.', (err) => {
    if (err) {
        console.error('Unable to write file. Check permissions:', err);
    } else {
        console.log('Test file written successfully.');
        fs.unlinkSync(testFilePath);
    }
});



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        console.log(`Destination directory: ${uploadDir}`);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log(`Created directory: ${uploadDir}`);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        console.log(`Saving file as: ${filename}`);
        cb(null, filename);
    }
});

router.post('/upload-profile-image', upload.single('profileImage'), (req, res) => {
    const file = req.file;
    const userId = req.body.id;

    console.log('Received file upload request:', file, userId);

    if (file && userId) {
        const filePath = `uploads/${file.filename}`;
        console.log(`File uploaded: ${filePath}`);

        pool.query('UPDATE Users SET PhotoLink = ? WHERE id = ?', [filePath, userId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'File uploaded successfully', filePath: filePath });
            } else {
                res.status(400).json({ success: false, message: 'User not found' });
            }
        });
    } else {
        res.status(400).json({ success: false, message: 'File upload failed or userId missing' });
    }
});
*/
//workspace code

/*router.post('/checkFirstTime', (req, res) => {
    const token = req.cookies.token;
    console.log('Test');

    try {
        const decoded = jwt.verify(token, secretKey);
        const email = decoded.email;
        const userId = decoded.id;

        const checkQuery = 'SELECT * FROM Users WHERE email = ? AND id = ? AND first_time = 1';
        con.query(checkQuery, [email, userId], (err, results) => {
            if (err) {
                console.log('Db error');
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results.length > 0) {
                console.log('First Time');
                return res.status(200).json({ message: "First time" });
            } else {
                console.log('Not First Time');
                return res.status(200).json({ message: "Not first time" });
            } 
        });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// Update first_time after the user sees the tutorial
router.post('/updateStatus', (req, res) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, secretKey);
        const email = decoded.email;
        const userId = decoded.id;

        const updateQuery = 'UPDATE Users SET first_time = 2 WHERE email = ? AND id = ?';
        con.query(updateQuery, [email, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database update error' });
            }
            console.log('Updating status');
            return res.status(200).json({ success: true });
        });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

router.post('/CheckFirstTime', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'NO_TOKEN', message: 'Token is required' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
        console.log('Decoded Token:', decoded); 
    } catch (err) {
        console.error('JWT Verification Error:', err);
        return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid or expired token' });
    }

    const userId = decoded.userId;
    const email = decoded.email;

    console.log('User ID:', userId, 'Email:', email); 
    const query = 'SELECT * FROM subject WHERE user_id = ?';
    con.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
        }

        let responseMessage = [];

        if (results.length === 0) {
            responseMessage.push({ error: 'ID_NOT_FOUND', message: 'First time' });
        } else {
            responseMessage.push({ error: 'ID_FOUND', message: 'Not first time' });
        }

        res.json({ responseMessage });
    });
});

router.post('/PutUserOnTable', (req, res) => {
    const token = req.cookies.token;
    let { Usersubjects } = req.body; 

    if (!token) {
        return res.status(401).json({ error: 'NO_TOKEN', message: 'Token is required' });
    }

    if (!Usersubjects) {
        return res.status(400).json({ error: 'INVALID_INPUT', message: 'Usersubjects is required' });
    }

    if (!Array.isArray(Usersubjects)) {
        Usersubjects = [Usersubjects];
    }

    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid or expired token' });
    }

    const userId = decoded.userId;

    const subjects = ['Math', 'Physic', 'Chemistry', 'CS', 'History', 'Portuguese', 'English', 'French', 'Spanish', 'Biology', 'Geography'];

    const query = 'SELECT * FROM subject WHERE user_id = ?';
    con.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            const insertQuery = `INSERT INTO subject (user_id, ${subjects.join(', ')}) VALUES (?, ${subjects.map(() => 0).join(', ')})`;
            con.query(insertQuery, [userId], (err) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to create user' });
                } else {
                    updateSubject(userId, Usersubjects, res);
                }
            });
        } else {
            updateSubject(userId, Usersubjects, res);
        }
    });
});

function updateSubject(userId, Usersubjects, res) {
    const subjectTranslations = {
        'Math': 'Matemática',
        'Physic': 'Física',
        'Chemistry': 'Química',
        'CS': 'Ciência da Computação',
        'History': 'História',
        'Portuguese': 'Português',
        'English': 'Inglês',
        'French': 'Francês',
        'Spanish': 'Espanhol',
        'Biology': 'Biologia',
        'Geography': 'Geografia'
    };

    // Reverse mapping from Portuguese to English
    const reverseSubjectTranslations = Object.fromEntries(
        Object.entries(subjectTranslations).map(([key, value]) => [value, key])
    );

    // Translate the Usersubjects to their English equivalents
    const selectedSubjects = Usersubjects.map(subject => reverseSubjectTranslations[subject] || subject);

    const subjects = ['Math', 'Physic', 'Chemistry', 'CS', 'History', 'Portuguese', 'English', 'French', 'Spanish', 'Biology', 'Geography'];
    let query = 'UPDATE subject SET ';
    const params = [];

    subjects.forEach((subject, index) => {
        query += `${subject} = ?`;
        if (index < subjects.length - 1) query += ', ';
        params.push(selectedSubjects.includes(subject) ? 1 : 0);
    });

    query += ' WHERE user_id = ?';
    params.push(userId);

    con.query(query, params, (err) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update subject' });
        }
        res.json({ message: 'User subjects updated successfully' });
    });
}
*/

/*Change user language */
router.post('/ChangeUserLanguage', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'NO_TOKEN', message: 'Token is required' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid or expired token' });
    }

    const userId = decoded.userId;
    const query = 'SELECT language FROM Users WHERE id = ?';

    con.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User not found' });
        }

        const userLanguage = results[0].language;

        let responseMessage = [];

        if (req.body.language === 'English') {
            responseMessage.push({ error: 'CHANGE_TO_ENGLISH', message: 'Changing language to English' });
        
            const updateQuery = `UPDATE Users SET language = ? WHERE id = ?`;
            con.query(updateQuery, [req.body.language, userId], (err) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update language' });
                }
            });
        } else if(req.body.language === 'Portuguese') {
            responseMessage.push({ error: 'CHANGE_TO_PORTUGUESE', message: 'Changing language to Portuguese' });
        
            const updateQuery = `UPDATE Users SET language = ? WHERE id = ?`;
            con.query(updateQuery, [req.body.language, userId], (err) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update language' });
                }
            });
        }
        res.json({ responseMessage, userLanguage });
    });
});
/* Check User language */
router.post('/CheckUserLanguage', (req, res) => {
    const token = req.cookies.token;
    let responseMessage = [];

    if (!token) {
        responseMessage.push({ error: 'NO_TOKEN', message: 'Change language to English' });

        return res.status(401).json({ error: 'NO_TOKEN', message: 'Token is required' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
        console.log('Decoded Token:', decoded); 
    } catch (err) {
        console.error('JWT Verification Error:', err);
        return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid or expired token' });
    }

    const userId = decoded.userId;
    console.log('User ID:', userId); 

    const query = 'SELECT language FROM Users WHERE id = ?';

    con.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
        }


        if (results.length === 0) {
            return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User not found', responseMessage });
        }

        const userLanguage = results[0].language;
        console.log('User Language:', userLanguage); 

        if (userLanguage === 'English') {
            responseMessage.push({ error: 'USER_PREFERS_ENGLISH', message: 'Change language to English' });
        }else if (userLanguage === 'Portuguese') {
            responseMessage.push({ error: 'USER_PREFERS_PORTUGUESE', message: 'Change language to Portuguese' });
        }

        res.json({ responseMessage });
    });
});

/* Change USer profile photo */
router.post('/userPhoto', upload.single('file'), (req, res) => {
    console.log('File received:', req.file);
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

    fs.rename(tempPath, targetPath, err => {
        if (err) {
            console.log('File move failed:', err);
            return res.status(500).json({ success: false, message: 'File move failed' });
        }

        const fileUrl = `http://localhost:3000/uploads/${req.file.originalname}`;
        console.log('File uploaded to:', fileUrl);
        res.json({ success: true, imageUrl: fileUrl });
    });
});

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.post('/updatePhotoLink', (req, res) => {
    const { photoLink } = req.body;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    const verifyUserQuery = 'SELECT * FROM Users WHERE id = ?';
    con.query(verifyUserQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updatePhotoLinkQuery = 'UPDATE Users SET PhotoLink = ? WHERE id = ?';
        con.query(updatePhotoLinkQuery, [photoLink, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to update photo link' });
            }

            res.json({ success: true });
        });
    });
});




// Put the user chat on the Database
router.post('/AddChat', (req, res) => {
    const token = req.cookies.token;
    const chatMessage = req.body.message; // Get the chat message from the frontend
    const uuid = uuidv4();
    console.log('User message: ', chatMessage);

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    // Insert the chat
    const addChatQuery = 'INSERT INTO Chats (chat_id, user_id, chat_name) VALUES (?, ?, ?)';
    con.query(addChatQuery, [uuid, userId, 'test'], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to add chat' });
        }

        // Insert the message
        const addMessageToChat = 'INSERT INTO Messages (user_id, chat_id, message_content) VALUES (?, ?, ?)';
        con.query(addMessageToChat, [userId, uuid, chatMessage], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Failed to add Message' });
            }

            // Respond after both the chat and message have been added successfully
            res.status(200).json({ success: true, message: 'Chat and message added successfully', uuid: uuid });
        });
    });

    console.log(`UUID: ${uuid}`);
    console.log(userId);
});

//Add Messages
router.post('/AddMessages', (req, res) => {
    const token = req.cookies.token;
    const chatMessage = req.body.message; // Get the chat message from the frontend
    const uuid = uuidv4();
    console.log(chatMessage)

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }
    const addMessageToChat = 'INSERT INTO Messages (user_id, chat_id, message_content) VALUES (?, ?, ?)';
    con.query(addMessageToChat, [userId, uuid, chatMessage ], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to add Message' });
        }
        res.status(200).json({ success: true, message: 'Message added successfully'});
    })

    console.log(`UUID: ${uuid}`);
    console.log(userId)
})

//Get User Text History and Chats
router.post('/GetUserInfo', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }
})

//Handle signout
router.post('/signout', (req, res) => {
    console.log('Signout route hit');
    res.clearCookie('loggedIn', { path: '/' });
    res.clearCookie('token', { path: '/' });
    console.log('Cookies cleared');

    res.status(200).json({ message: 'Signed out successfully' });
});
module.exports = con;
module.exports = router;

