import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from '../Js/auth.js'; // Import auth routes

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use('/Logo', express.static(path.join(__dirname, '../Logo')));
app.use('/Css', express.static(path.join(__dirname, '../Css')));
app.use('/wallpapers', express.static(path.join(__dirname, '../wallpapers')));
app.use('/Country_Flags', express.static(path.join(__dirname, '../Country_Flags')));
app.use('/Features_Images', express.static(path.join(__dirname, '../Features_Images')));
app.use('/UserIcon', express.static(path.join(__dirname, '../UserIcon')));
app.use('/Js', express.static(path.join(__dirname, '../Js')));

function ensureNotLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        return res.redirect('/workspace');
    }
    next();
}

function ensureLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', ensureNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});

const roadToHome = '/home';
app.get(roadToHome.toLowerCase(), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});

const roadToLogin = '/login';
app.get(roadToLogin.toLowerCase(), ensureNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Login-Page.html'));
});

const roadToSignUp = '/signup';
app.get(roadToSignUp.toLowerCase(), ensureNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Sign-up-Page.html'));
});

const MyWorkSpace = '/workspace';
app.get(MyWorkSpace.toLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/workspace.html'));
});

const Settings = '/settings';
app.get(Settings.toLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Settings.html'));
});

const SettingsAccount = '/settings/account';
app.get(SettingsAccount.toLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Settings.html'));
});

const SettingsProfile = '/settings/profile';
app.get(SettingsProfile.toLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/SettingsProfile.html'));
});

app.post('/signout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('loggedIn');
    res.status(200).json({ message: 'Signed out successfully' });
});

const roadToForgotPassword = '/forgotpassword';
app.get(roadToForgotPassword.toLowerCase(), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/forgotpassword.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/test.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../html/Page-Not-Found.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});