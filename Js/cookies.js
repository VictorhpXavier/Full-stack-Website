const jwt = require("jsonwebtoken")

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        req.user = user
        next()
     } catch(err) {
            res.clearCookie("token")
            return res.redirect("/")
        }
    }


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
                            con .query(updateQuery, [email, userId], (err, result) => {
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
