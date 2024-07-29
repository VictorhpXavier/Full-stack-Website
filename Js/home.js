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
            if (
                DropDownMenu.style.display === 'none' ||
                DropDownMenu.style.display === ''
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
    //Dark mode Logic
    const DarkModeButton = document.querySelector('#DarkMode');
    const brandSpans = document.querySelectorAll('.brand h1 span');
    const headerLinks = document.querySelectorAll('#header .nav-list ul a');
    const mainthemeH1 = document.querySelectorAll('#MainTheme h1');
    const servicesH3 = document.querySelectorAll('#Services h3');
    const servicesP = document.querySelectorAll('#Services p');
    const features = document.querySelectorAll('#Services .feature');
    const footer = document.querySelector('#footer');
    const footerbutton = document.querySelectorAll('#footer button');

    function applyDarkMode(isDarkMode) {
        if (isDarkMode) {
            if (
                document.body.style.backgroundColor === 'rgb(208, 236, 253)' ||
                document.body.style.backgroundColor === ''
            ) {
                document.body.style.backgroundColor = '#121212';
                brandSpans.forEach((span) => {
                    span.style.color = '#9acdec';
                });
                document.querySelector('#header').style.backgroundColor =
                    '#121212';
                headerLinks.forEach((link) => {
                    link.style.color = '#489be0';
                });
                mainthemeH1.forEach((h1) => {
                    h1.style.color = '#8f9195';
                });
                servicesH3.forEach((h3) => {
                    h3.style.color = '#489be0';
                });
                servicesP.forEach((p) => {
                    p.style.color = '#97bfec';
                });
                features.forEach((feature) => {
                    feature.style.backgroundColor = '#282828';
                });

                footerbutton.forEach((button) => {
                    button.style.color = 'white';
                });
                document.querySelector('#footer button').style.color = 'white';
                document.querySelector('#footer .Li-Language').style.color =
                    'white';
                footer.style.color = 'white';
                footer.style.backgroundColor = '#575757';
                mainthemeP.style.color = '#717171';
            } else {
                clearDarkModePreference();
                document.body.style.backgroundColor = '';
                brandSpans.forEach((span) => {
                    span.style.color = '';
                });
                document.querySelector('#header').style.backgroundColor = '';
                headerLinks.forEach((link) => {
                    link.style.color = '';
                });
                mainthemeH1.forEach((h1) => {
                    h1.style.color = '';
                });
                servicesH3.forEach((h3) => {
                    h3.style.color = '';
                });
                servicesP.forEach((p) => {
                    p.style.color = '';
                });
                features.forEach((feature) => {
                    feature.style.backgroundColor = '';
                });
                document.querySelector('#footer button').style.color = '';
                document.querySelector('#footer .Li-Language').style.color = '';
                footer.style.color = '';
                footer.style.backgroundColor = '';
                document.querySelector('#Services-Class h1').style.color = '';
                mainthemeP.style.color = '';
            }
        }
    }
    // Fetch the dark mode preference from the backend
    fetch('/darkmode', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Dark mode preference from server:', data.darkMode);
            if (data.darkMode) {
                applyDarkMode(true);
            }

            if (DarkModeButton) {
                DarkModeButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    const isDarkMode =
                        !document.body.classList.contains('dark-mode');
                    console.log('Toggling dark mode to:', isDarkMode);
                    applyDarkMode(isDarkMode);
                    setDarkModePreference(isDarkMode);
                });
            }
        })
        .catch((error) =>
            console.error('Error fetching dark mode preference:', error)
        );
    function setDarkModePreference(isDarkMode) {
        fetch('/darkmode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ darkMode: isDarkMode }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Dark mode preference saved successfully.');
                } else {
                    console.error('Failed to save dark mode preference.');
                }
            })
            .catch((error) =>
                console.error('Error saving dark mode preference:', error)
            );
    }
    function clearDarkModePreference() {
        fetch('/cleardarkmode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Dark mode preference cleared successfully.');
                } else {
                    console.error('Failed to clear dark mode preference.');
                }
            })
            .catch((error) =>
                console.error('Error clearing dark mode preference:', error)
            );
    }
   
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
                if (error.error === 'NO_PASSWORD') {
                    passwordError.style.display = 'block';
                    passwordError.innerHTML = error.message;
                    document.querySelector('#password').style.border = '2px solid red';
                } else if (error.error === 'INVALID_PASSWORD') {
                    passwordError.style.display = 'block';
                    passwordError.innerHTML = '';
                    document.querySelector('#password').style.border = '2px solid red';
                    errorsDiv.style.display = 'flex';

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
            } 
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
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