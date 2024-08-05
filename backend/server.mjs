import express from "express";
import bodyParser from "body-parser";
import path from "path";
import DeviceLogger from './DeviceLogger.js'
import authRoutes from './auth.js'; // Import auth routes
import cookieParser from 'cookie-parser';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(DeviceLogger)

app.use(authRoutes);

const port = 3002;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use('/Logo', express.static(path.join(__dirname, '../Logo')));
app.use('/Css', express.static(path.join(__dirname, '../Css')));
app.use('/wallpapers', express.static(path.join(__dirname, '../wallpapers')));
app.use('/Country_Flags', express.static(path.join(__dirname, '../Country_Flags')));
app.use('/Features_Images', express.static(path.join(__dirname, '../Features_Images')))
app.use('/UserIcon', express.static(path.join(__dirname, '../UserIcon')));
app.use('/imagesRevamp', express.static(path.join(__dirname, '../imagesRevamp')))
app.use('/mascot', express.static(path.join(__dirname, '../mascot')))
app.use('/Js', express.static(path.join(__dirname, '../Js')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/python', express.static(path.join(__dirname, '../python')))

function ensureNotLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (token) {

        return res.redirect('/workspace');

    }
    next();
}
function ensureLoggedIn(req, res, next) {
    const token = req.cookies.token
    if(!token) {
        return res.redirect('/login')
    }
    next()
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});

const roadToHome = '/home';
app.get(roadToHome.toLowerCase(), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});

const roadToLogin = '/login';
app.get(roadToLogin.toLocaleLowerCase(), ensureNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Login-Page.html'));
});

const roadToSignUp = '/signup';
app.get(roadToSignUp.toLocaleLowerCase(), ensureNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Sign-up-Page.html'))
    
})
const MyWorkSpace = '/workspace';
app.get(MyWorkSpace.toLocaleLowerCase(),  ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/workspace.html'))
})

const Settings = '/settings'
app.get(Settings.toLocaleLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Settings.html'))
})

const SettingsAccount = '/settings/account'
app.get(SettingsAccount.toLocaleLowerCase(),  ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Settings.html'))
})

const SettingsProfile = '/settings/profile'
app.get(SettingsProfile.toLocaleLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/SettingsProfile.html'))
})



const roadToForgotPassword = '/forgotpassword'
app.get(roadToForgotPassword.toLocaleLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/forgotpassword.html'))
});

const roadToChatWS = '/workspace/chat'
app.get(roadToChatWS.toLocaleLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Chat.html'))
})
const roadToChatWSWithId = '/workspace/chat';
app.get(`${roadToChatWSWithId.toLocaleLowerCase()}/:id`, ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Chat.html'));
});

const roadToVideoCreatorWS = '/workspace/videocreator'
app.get(roadToVideoCreatorWS.toLocaleLowerCase(), ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/videocreator.html'))
})

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/test.html'))
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../html/Page-Not-Found.html'));
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});