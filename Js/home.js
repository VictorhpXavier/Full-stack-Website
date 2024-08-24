/*
const hamburger = document.querySelector(
    '.header .nav-bar .nav-list .hamburger'
);
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll(
    '.header .nav-bar .nav-list ul li a'
);
const header = document.querySelector('.header .container');
const hamburgerButton = document.querySelector('#header .nav-list .hamburger');
const brandSpans = document.querySelectorAll('.brand h1 span');
const CenaChata = document.querySelector('#header .nav-list ul');

hamburgerButton.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
    if (mobile_menu.classList.contains('active')) {
        mobile_menu.querySelectorAll('a').forEach((item) => {
            item.style.color = 'white';
        });
        brandSpans.forEach((span) => {
            span.style.color = 'white';
        });
        CenaChata.style.backgroundColor = 'rgb(31, 30, 30)';
        document.body.style.overflow = 'hidden';
        CenaChata.style.display = 'flex';
    } else {
        mobile_menu.querySelectorAll('a').forEach((item) => {
            item.style.color = '';
        });
        brandSpans.forEach((span) => {
            span.style.color = '';
        });
        document.body.style.overflow = '';
        CenaChata.style.display = '';
    }
});
*/


document.addEventListener('DOMContentLoaded', function () {
    
    /*
    //Check User language preference
    const languageButton = document.querySelector('#footer .Country-Flag');
    const options = document.querySelectorAll('#footer .dropdown .option');
    const ChooseLangue = document.querySelector('#footer .dropdown');
    const mainthemeP = document.querySelector('#MainTheme p');
    const SignUp = document.querySelector('.FreeSignUp .FreeSignUp-Button');
    const DemoButton = document.querySelector('.Demo-Video-Button');
    const AboutH1 = document.querySelector('#About-section h1');
    const AboutH2 = document.querySelector('#About-section h2');
    const AboutEn = document.querySelector('#About-section p');
    const AboutPt = document.querySelector('#About-section .P-pt');
    const ServicesH1 = document.querySelector('.Services-Class h1');
    const featureEn = document.querySelector('#Services .features');
    const featuresPt = document.querySelector('#Services .FeaturesPt');
    const userFlag = document.querySelector('#footer .Country-Flag');
    const h1 = document.querySelector('#MainTheme .h1');
    const h1Pt = document.querySelector('#MainTheme .h1Pt');

    // Ensure the element exists
    if (languageButton) {
        languageButton.addEventListener('click', function () {
            if (
                ChooseLangue.style.display === 'none' ||
                ChooseLangue.style.display === ''
            ) {
                ChooseLangue.style.display = 'block';

                options.forEach((option) => {
                    option.addEventListener('click', () => {
                        if (option.textContent === 'Portuguese') {
                            mainthemeP.innerHTML =
                                'Aprender o seu conteúdo favorito nunca foi tão fácil. <br> Vídeos interativos irão guiá-lo do nível iniciante ao mestre.';
                            SignUp.innerHTML = 'Registre-se';
                            DemoButton.innerHTML = 'Assistir Demo';
                            AboutH1.innerHTML = 'Sobre VHX';
                            AboutH2.innerHTML = 'Nossa História';
                            ServicesH1.innerHTML = 'Recursos e serviços';
                            featureEn.style.display = 'none';
                            featuresPt.style.display = 'flex';
                            userFlag.style.backgroundImage =
                                'url(../Country_Flags/pt.png)';
                            h1.style.display = 'none';
                            h1Pt.style.display = 'block';
                            h1Pt.style.left = '0%';
                            AboutEn.style.display = 'none';
                            AboutPt.style.display = 'block';
                        } else {
                            location.reload();
                        }
                        if (option) {
                            ChooseLangue.style.display = 'none';
                            fetch('/ChangeUserLanguage', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    language: option.textContent,
                                }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.responseMessage) {
                                        data.responseMessage.forEach(
                                            (error) => {
                                                if (
                                                    error.error ===
                                                    'CHANGE_TO_ENGLISH'
                                                ) {
                                                    location.reload();
                                                } else if (
                                                    error.error ===
                                                    'CHANGE_TO_PORTUGUESE'
                                                ) {
                                                    location.reload();
                                                }
                                            }
                                        );
                                    }
                                });
                        }
                    });
                });
            } else {
                ChooseLangue.style.display = 'none';
            }
        });
    }

    fetch('/CheckUserLanguage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
    })
        .then((response) => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then((data) => {
            if (data.responseMessage && data.responseMessage.length > 0) {
                data.responseMessage.forEach((message) => {
                    if (message.error === 'NO_TOKEN') {
                        mainthemeP.innerHTML =
                            'Learning your favorite subject has never been easier.<br>Interactive videos will guide you from beginner to master level.';
                        DemoButton.innerHTML = 'Watch Demo';
                        AboutH1.innerHTML = 'About';
                        AboutH2.innerHTML = 'Our History';
                        h1.style.display = 'block';
                        h1Pt.style.display = 'none';
                        featureEn.style.display = 'flex';
                        featuresPt.style.display = 'none';
                        AboutEn.style.display = 'block';
                        AboutPt.style.display = 'none';
                    }
                    if (message.error === 'USER_PREFERS_ENGLISH') {
                        mainthemeP.innerHTML =
                            'Learning your favorite subject has never been easier.<br>Interactive videos will guide you from beginner to master level.';
                        SignUp.innerHTML = '';
                        DemoButton.innerHTML = 'Watch Demo';
                        AboutH1.innerHTML = 'About';
                        AboutH2.innerHTML = 'Our History';
                        h1.style.display = 'block';
                        h1Pt.style.display = 'none';
                        featureEn.style.display = 'flex';
                        featuresPt.style.display = 'none';
                        AboutEn.style.display = 'block';
                        AboutPt.style.display = 'none';
                    }
                    if (message.error === 'USER_PREFERS_PORTUGUESE') {
                        mainthemeP.innerHTML =
                            'Aprender o seu conteúdo favorito nunca foi tão fácil. <br> Vídeos interativos irão guiá-lo do nível iniciante ao mestre.';
                        SignUp.innerHTML = 'Registre-se';
                        DemoButton.innerHTML = 'Assistir Demo';
                        AboutH1.innerHTML = 'Sobre VHX';
                        AboutH2.innerHTML = 'Nossa História';
                        ServicesH1.innerHTML = 'Recursos e serviços';
                        featureEn.style.display = 'none';
                        featuresPt.style.display = 'flex';
                        userFlag.style.backgroundImage =
                            'url(../Country_Flags/pt.png)';
                        h1.style.display = 'none';
                        h1Pt.style.display = 'block';
                        h1Pt.style.left = '0%';
                        AboutEn.style.display = 'none';
                        AboutPt.style.display = 'block';
                    }
                });
            }
        });
        */
    //If user is Logged In then show the Profile Menu and remove the register / login
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    // Handle Profile pic
    const token = getCookie('token');
    const loggedIn = getCookie('loggedIn');
    if (token || loggedIn === 'true') {
        const LoginElement = document.querySelector('#header .Auth .Login');
        const AccountStatus = document.querySelector('#header .Auth ul li a #Circle');
        document.querySelector('.SignUpul').style.display = 'none';
        document.querySelector('#MainContent .SignUpbutton button').innerHTML = 'Start Working'
        document.querySelector('#MainContent .SignUpbutton button').href = '/workspace'
        console.log('User is logged in. Modifying the DOM accordingly.');
        LoginElement.style.marginTop = '100px'
        LoginElement.innerHTML = 'WorkSpace';
        LoginElement.href = '/workspace';
        LoginElement.dataset.after = 'Work\nspace';
        document.querySelector('#CTA').style.display = 'none'
        AccountStatus.style.display = 'inline-block';
        updateUserPhotoLink()
    }
    
    // Toggle dropdown menu visibility
    const CircleButton = document.querySelector('#header .Auth #CircleButton');
    const DropDownMenu = document.querySelector('#header .DropDownMenu');
    
    
    //Handle Profile Menu

    const SignOutButton = document.querySelector('.DropDownMenu .DropDownContent #SignOut' );

    if (CircleButton) {
        CircleButton.addEventListener('click', function () {
            if (DropDownMenu.style.display === 'none' || DropDownMenu.style.display === ''
) {
                DropDownMenu.style.display = 'inline-block';
            } else {
                DropDownMenu.style.display = 'none';
            }
        });
    }
    window.addEventListener('click', (event) => {
        if (CircleButton && !CircleButton.contains(event.target)) {
            DropDownMenu.style.display = 'none';
        }
    });
    if (SignOutButton) {
        SignOutButton.addEventListener('click', function () {
            // Clear cookies
            document.cookie =
                'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie =
                'loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // Optionally make a request to the server to clear any server-side session
            fetch('/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.message);
                    // Redirect the user to the login page or home page
                    window.location.href = '/login';
                })
                .catch((error) => console.error('Error:', error));
        });
    }
    //Dark mode logic
    const header = document.getElementById('header');
    const logoSpan = document.querySelector('#header .Logo h1');
    const mainRoutes = document.querySelectorAll('#header .MainRoutes ul a');
    const authLinks = document.querySelectorAll('#header .Auth ul a');
    const mainContentH1 = document.querySelector('#MainContent h1');
    const mainContentP = document.querySelector('#MainContent p');
    const watchDemo = document.querySelector('#MainContent .WatchDemo button');
    const demoVideoH1 = document.querySelector('#DemoVideo h1');
    const demoVideoBg = document.querySelector('#DemoVideo .Background');
    const featuresH1 = document.querySelector('#Features .title h1')
    const boxH1 = document.querySelectorAll('#Features .box-container h1')
    const box1 = document.querySelector('#Features .box1');
    const box2 = document.querySelector('#Features .box2');
    const box3 = document.querySelector('#Features .box3');
    const aboutTile = document.querySelector('#About .Title')
    const mainBox = document.querySelector('#About .MainBox')
    const mainBoxP = document.querySelector('#About .MainBox .content p')
    const mainBoxSpan = document.querySelector('#About .MainBox .content span')
    const SecondaryBox = document.querySelector('#About .SecondaryBox')
    const SecondaryBoxP = document.querySelectorAll('#About .MainBox .SecondaryBox p')
    const SecondaryBoxSpan = document.querySelector('#About .SecondaryBox .content span')
    const MainBox2 = document.querySelector('#About .MainBox2')
    const MainBox2P = document.querySelectorAll('#About .MainBox2 .content p')
    const SecondaryBox2 = document.querySelector('#About .SecondaryBox2')
    const SecondaryBox2P = document.querySelectorAll('#About .MainBox2 .SecondaryBox2 p')
    const aboutTileS = document.querySelector('#AboutSmallScreen .Title')
    const mainBoxS = document.querySelector('#AboutSmallScreen ')
    const mainBoxPS = document.querySelector('#AboutSmallScreen  .content p')
    const mainBoxSpanS = document.querySelector('#AboutSmallScreen  .content span')
    const SecondaryBoxS = document.querySelector('#AboutSmallScreen ')
    const SecondaryBoxPS = document.querySelectorAll('#AboutSmallScreen   p')
    const SecondaryBoxSpanS = document.querySelector('#AboutSmallScreen  .content span')
    const MainBox2S = document.querySelector('#AboutSmallScreen')
    const MainBox2PS = document.querySelectorAll('#AboutSmallScreen  .content p')
    const SecondaryBox2S = document.querySelector('#AboutSmallScreen ')
    const SecondaryBox2PS = document.querySelectorAll('#AboutSmallScreen   p')
    const footer = document.querySelector('footer');
    const footerH1 = document.querySelector('footer .footer-content h1');
    const footerLogoP = document.querySelector('.footer-logo p');
    const FooterA = document.querySelectorAll('footer a');
    function applyDarkMode(isDarkMode) {
        if (isDarkMode) {
            document.body.style.backgroundColor = '#121212';
            header.style.backgroundColor = '#121212';
            if (logoSpan) logoSpan.style.color = '#128fdc';
            mainRoutes.forEach(link => link.style.color = '#128fdc');
            authLinks.forEach(link => link.style.color = '#128fdc');
            if (mainContentH1) mainContentH1.style.color = '#66aaff';
            if (mainContentP) mainContentP.style.color = '#e0e0e0';
            if (watchDemo) watchDemo.style.color = '#e0e0e0';
            if (demoVideoH1) demoVideoH1.style.color = '#e0e0e0';
            if (demoVideoBg) demoVideoBg.style.backgroundColor = '#6080f4';
            if(featuresH1) featuresH1.style.color = '#e0e0e0'

            if (box1) box1.classList.add('active');
            if (box2) box2.classList.add('active');
            if (box3) box3.classList.add('active');
            boxH1.forEach(h1 => h1.style.color = '#6080f4')
            if(aboutTile) aboutTile.style.color = '#e0e0e0'
            if(aboutTileS) aboutTileS.style.color = '#e0e0e0'
            if(mainBox) mainBox.style.backgroundColor = '#262626'
            if(mainBoxP) mainBoxP.style.color = '#e0e0e0'
            if(mainBoxSpan) mainBoxSpan.style.color = '#6080f4'
            if(SecondaryBox) SecondaryBox.style.backgroundColor = '#030303'
            if(SecondaryBoxSpan) SecondaryBoxSpan.style.color = '#6080f4'    
            SecondaryBoxP.forEach(p => p.style.color = '#e0e0e0')
            if(MainBox2) MainBox2.style.backgroundColor = '#030303'

            MainBox2P.forEach(p => p.style.color ='#e0e0e0')
            if(mainBoxS) mainBoxS.style.backgroundColor = '#262626'
            if(mainBoxPS) mainBoxPS.style.color = '#e0e0e0'
            if(mainBoxSpanS) mainBoxSpanS.style.color = '#6080f4'
            if(SecondaryBoxS) SecondaryBoxS.style.backgroundColor = '#030303'
            if(SecondaryBoxSpanS) SecondaryBoxSpan.style.color = '#6080f4'
            SecondaryBoxPS.forEach(ps => ps.style.color = '#e0e0e0')
            if(MainBox2S) MainBox2S.style.backgroundColor = '#030303'
            MainBox2PS.forEach(ps => ps.style.color ='#e0e0e0')
            SecondaryBox2PS.forEach(pS => pS.style.color = '#e0e0e0')
            if(SecondaryBox2S) SecondaryBox2S.style.backgroundColor = '#262626'

            SecondaryBox2P.forEach(p => p.style.color = '#e0e0e0')
            if(SecondaryBox2) SecondaryBox2.style.backgroundColor = '#262626'
            document.querySelector('footer').style.backgroundColor = '#262626'
            document.querySelector('footer .footer-content h1').style.color = '#6080f4'
            document.querySelector('.footer-logo p ').style.color = '#e0e0e0'
            FooterA.forEach(A => A.style.color = '#e0e0e0')
        } else {
            document.body.style.backgroundColor = '';
            header.style.backgroundColor = '';
            if (logoSpan) logoSpan.style.color = '';
            mainRoutes.forEach(link => link.style.color = '');
            authLinks.forEach(link => link.style.color = '');
            if (mainContentH1) mainContentH1.style.color = '';
            if (mainContentP) mainContentP.style.color = '';
            if (watchDemo) watchDemo.style.color = '';
            if (demoVideoH1) demoVideoH1.style.color = '';
            if (demoVideoBg) demoVideoBg.style.backgroundColor = '';
            if (featuresH1) featuresH1.style.color = '';
            
            if (box1) box1.classList.remove('active');
            if (box2) box2.classList.remove('active');
            if (box3) box3.classList.remove('active');
            boxH1.forEach(h1 => h1.style.color = '');
            if (aboutTile) aboutTile.style.color = '';
            if (mainBox) mainBox.style.backgroundColor = '';
            if (mainBoxP) mainBoxP.style.color = '';
            if (mainBoxSpan) mainBoxSpan.style.color = '';
            if (SecondaryBox) SecondaryBox.style.backgroundColor = '';
            if (SecondaryBoxSpan) SecondaryBoxSpan.style.color = '';
            SecondaryBoxP.forEach(p => p.style.color = '');
            if (MainBox2) MainBox2.style.backgroundColor = '';
            MainBox2P.forEach(p => p.style.color = '');
            SecondaryBox2P.forEach(p => p.style.color = '');
            if (SecondaryBox2) SecondaryBox2.style.backgroundColor = '';
            if (footer) footer.style.backgroundColor = '';
            if (footerH1) footerH1.style.color = '';
            if (footerLogoP) footerLogoP.style.color = '';
            FooterA.forEach(a => a.style.color = '');
            MainBox2P.forEach(p => p.style.color ='')
            if(mainBoxS) mainBoxS.style.backgroundColor = ''
            if(mainBoxPS) mainBoxPS.style.color = ''
            if(mainBoxSpanS) mainBoxSpanS.style.color = ''
            if(SecondaryBoxS) SecondaryBoxS.style.backgroundColor = ''
            if(SecondaryBoxSpanS) SecondaryBoxSpan.style.color = ''
            SecondaryBoxPS.forEach(ps => ps.style.color = '')
            if(MainBox2S) MainBox2S.style.backgroundColor = ''
            MainBox2PS.forEach(ps => ps.style.color ='')
            SecondaryBox2PS.forEach(pS => pS.style.color = '')
            if(SecondaryBox2S) SecondaryBox2S.style.backgroundColor = ''

        }
    }
    //Dark mode Logic
    fetch('/CheckDarkMode', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success && data.message === 'Dark mode is ON') {
            applyDarkMode(true);
            document.body.classList.add('dark-mode');
        } else {
            applyDarkMode(false);
            document.body.classList.remove('dark-mode');
        }
    })
    .catch((error) => console.error('Error fetching dark mode status:', error));


    const darkModeButton = document.querySelector('#header .DropDownMenu .DropDownContent #DarkMode');
    darkModeButton.addEventListener('click', (event) => {
        event.preventDefault();
        fetch('/setDarkMode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const isDarkMode = !document.body.classList.contains('dark-mode');
                applyDarkMode(isDarkMode);
                document.body.classList.toggle('dark-mode', isDarkMode);
            } else {
                console.error('Failed to toggle dark mode:', data.message);
            }
        })
        .catch((error) => console.error('Error setting dark mode:', error));
    })

});


document.addEventListener('DOMContentLoaded', function() {
    const showButton = document.querySelector('#CTA .form-content .ShowButton');
    const passwordField = document.querySelector('#password');
    const signUpButton = document.querySelector('#CTA .form-content .Sign-Up-button');
    if (showButton) {
        showButton.addEventListener('click', function() {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                showButton.textContent = 'hide';
            } else {
                passwordField.type = 'password';
                showButton.textContent = 'show';
            }
        });
    }

    if (signUpButton) {
        signUpButton.addEventListener('click', handleRegistration);
    }
});

function handleRegistration(event) {
    event.preventDefault();
    const emailValue = document.querySelector('#email').value.trim();
    const passValue = document.querySelector('#password').value.trim();
    const emailError = document.querySelector('.EmailError');
    const passwordError = document.querySelector('.PasswordError');
    const errorsDiv = document.querySelector('.Errors');
    const CTABox = document.querySelector('#CTA')
    let screenSize = window.innerWidth
    const showPasswordBtn = document.querySelector('#signup-form .Password-container .ShowButton')
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    errorsDiv.style.display = 'none';

    const data = { email: emailValue, password: passValue };
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            data.errors.forEach(error => {
                    if(error.error) {
                        if(screenSize < 481) {
                            CTABox.style.height = '488px'
                        } else {
                            showPasswordBtn.style.marginTop = '-21px'
                        }
                        
                        if (error.error === 'NO_PASSWORD') {
                            passwordError.style.display = 'block';
                            passwordError.innerHTML = error.message;
                            document.querySelector('#password').style.border = '2px solid red';
                        } else if (error.error === 'INVALID_PASSWORD') {
                            passwordError.style.display = 'block';
                            passwordError.innerHTML = '';
                            document.querySelector('#password').style.border = '2px solid red';
                            errorsDiv.style.display = 'flex';
                            if(screenSize < 481) {
                                CTABox.style.height = '580px'
                            }
                                const requirements = {
                                    Char: { 
                                        regex: /.{8,}/, 
                                        element: document.getElementById('CharI') 
                                    },
                                    Cap: { 
                                        regex: /[A-Z]/, 
                                        element: document.getElementById('Cap') 
                                    },
                                    Spec: { 
                                        regex: /[!"#$%&'()*+,-./:;<=>?@\[\\\]_`{}~]/, // Escaped square brackets and backslash
                                        element: document.getElementById('Spec') 
                                    },
                                    Num: { 
                                        regex: /\d/, 
                                        element: document.getElementById('Num') 
                                    },
                                };
                            
                                for (const key in requirements) {
                                    if (requirements[key].regex.test(passValue)) {
                                        requirements[key].element.classList.remove('fa-xmark');
                                        requirements[key].element.classList.add('fa-check');
                                        requirements[key].element.style.color = 'green';
                                        requirements[key].element.parentElement.style.color = 'green'; 
                                    } else {
                                        requirements[key].element.classList.remove('fa-check');
                                        requirements[key].element.classList.add('fa-xmark');
                                        requirements[key].element.style.color = 'red';
                                        requirements[key].element.parentElement.style.color = 'red'; 
                                        isValid = false;
                                    }
                                }
                            
                                
                            }
                           
                            else if (error.error === 'NO_EMAIL') {
                                emailError.style.display = 'block';
                                emailError.innerHTML = error.message;
                                document.querySelector('#signup-form #email').style.border = '2px solid red';
                            }
                            else if (error.error === 'INVALID_EMAIL') {
                                emailError.style.display = 'block';
                                emailError.innerHTML = error.message;
                                document.querySelector('#signup-form #email').style.border = '2px solid red';
                            }
                            else if (error.error === 'EMAIL_ALREADY_EXISTS') {
                                emailError.style.display = 'block';
                                passwordError.style.display = 'none';
                                emailError.innerHTML = error.message;
                                document.querySelector('#signup-form #email').style.border = '2px solid red';
                                document.querySelector('#password').style.border = '2px solid rgba(0, 0, 0, 0.2)';
                          } 
                          
                    }
                    
                    
            });
            
        } else {
            passwordError.style.display = 'asd';
            emailError.style.display = 'none';
            document.querySelector('#signup-form #email').style.border = '2px solid rgba(0, 0, 0, 0.2)';
            document.querySelector('#password').style.border = 'blue';
            window.location.href = '/home'
            console.log('Login successful');

        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function updateUserPhotoLink() {
    const pfpDropDown  = document.querySelector('#header .DropDownMenu .ProfileHeader .ProfileImg .img')
    fetch('/updatePhotoLink', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are sent with the request
    })
    .then(response => response.json())
    .then(data => {
        const circleElement = document.querySelector('#header .Auth ul li a #Circle');
        if (data.success) {
            if (data.photoLink) {
                const photoUrl = `/uploads/${data.photoLink}`;
                circleElement.style.backgroundImage = `url(${photoUrl})`;
                pfpDropDown.style.backgroundImage = `url(${photoUrl})`;
                pfpDropDown.addEventListener('mouseover', () => {
                    pfpDropDown.style.backgroundImage = 'url(../UserIcon/upload.png)'
                })
                pfpDropDown.addEventListener('mouseout', () => {
                    pfpDropDown.style.backgroundImage = `url(${photoUrl})`;
                })
                document.getElementById('fileInput').addEventListener('change', function(event) {
                    const fileInput = event.target;
                    const file = fileInput.files[0];
                
                    if (!file) {
                        return;
                    }
                
                    const formData = new FormData();
                    formData.append('file', file);
                
                    fetch('/userPhoto', {  
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const imageUrl = data.imageUrl;
                            updateUserPhotoLink(imageUrl);
                        } 
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                });
                    
                    
            } 
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
    const userNameElement = document.querySelector('#header .DropDownMenu .ProfileHeader .ProfileImg .UserInfo h1');
    const userEmailElement = document.querySelector('#header .DropDownMenu .ProfileHeader .ProfileImg .UserInfo h2');
    fetch('/UserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are sent with the request
    })
    .then(response => response.json())
    .then(data => { 
        let userName = data.UserName;
        let userEmail = data.email;
        
        // Truncate userName if it's longer than 11 characters
        if (userName.length > 11) {
            userName = userName.slice(0, 11) + "..."; 
        }
        userNameElement.innerHTML = userName; 
    
        // Handle the email truncation
        if (userEmail.length > 21) {
            let generatedName = userEmail.split("@")[0];
            if (generatedName.length > 11) {
                generatedName = generatedName.slice(0, 11) + "..."; 
            }
            userEmail = generatedName + "@" + userEmail.split("@")[1]; // Reconstruct the email
        }
        userEmailElement.innerHTML = userEmail; 
    })
}


document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const header = document.querySelector('#header');
    const authButtons = document.querySelector('#header .Auth');
    const mainRoutes = document.querySelector('#header .MainRoutes');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            authButtons.classList.toggle('visible');
            mainRoutes.classList.toggle('visible');
            header.classList.toggle('active');
        });
    }

});