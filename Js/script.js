
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.Login-Button').addEventListener('click', handleLogin);
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.Sign-up .Sign-Up-button').addEventListener('click', handleRegistration); 
})
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.Recover-Button').addEventListener('click', RecoverPassword)
})

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.about-button').addEventListener('click', rollOver);
})
document.addEventListener('scroll', () => {
    var scroll_position = window.scrollY;
    if (scroll_position > 10) {
        header.style.backgroundColor = '#9fdaff';
    } else {
        header.style.backgroundColor = 'transparent';
    }
});
//Show and Hide Password on the login / signup page
document.addEventListener('DOMContentLoaded', function() {
    const showButton = document.querySelector('.ShowButton');
    const passwordField = document.querySelector('.Password');

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
    document.querySelector('.SubmitButton').addEventListener('click', handleRegistration);
});
//If user is Logged In then show the Profile Menu and remove the register / login
document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    
    const token = getCookie('token');
    const loggedIn = getCookie('loggedIn');

    if (token || loggedIn === 'true') {
        const LoginElement = document.getElementById('Login');
        const AccountStatus = document.getElementById('Circle');
        

        console.log('User is logged in. Modifying the DOM accordingly.');

        LoginElement.innerHTML = "WorkSpace";
        LoginElement.href = '/workspace';
        LoginElement.dataset.after = 'Work\nspace';
        document.getElementById('Register').innerHTML = '';
        AccountStatus.style.display = 'inline-block';

    } else {
        console.log('User is not logged in.');
    }
});
//Handle Profile Menu
document.addEventListener('DOMContentLoaded', function() {
    const CircleButton = document.querySelector('#CircleButton'); 
    const DropDownMenu = document.querySelector('.DropDownMenu');
    const SignOutButton = document.querySelector('.DropDownMenu .DropDownContent #SignOut');

    if (CircleButton) {
        CircleButton.addEventListener('click', function() {
            if (DropDownMenu.style.display === 'none' || DropDownMenu.style.display === '') {
                DropDownMenu.style.display = 'inline-block';
            } else {
                DropDownMenu.style.display = 'none';
            }
        });
    }

    if (SignOutButton) {
        SignOutButton.addEventListener('click', function() {
            // Clear cookies
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Optionally make a request to the server to clear any server-side session
            fetch('/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                // Redirect the user to the login page or home page
                window.location.href = '/login';
            })
            .catch(error => console.error('Error:', error));
        });
    }
});


//Handle Style customization
document.addEventListener('DOMContentLoaded', function() {
    const emailText = document.querySelector('#Settings .SettingsContainer p');
    const AccountText = document.querySelector('#Settings .SettingsContainer .SettingUl .Account');
    const ProfileText = document.querySelector('#Settings .SettingsContainerProfile .SettingUl .Profile');
    const ChangeEmail = document.querySelector('#ChangeEmail .ChangeEmail');
    const UserEmail = document.querySelector('#ChangeEmail #ChangeEmailForm .ChangeEmail .UserEmail');
    const ChangePassword = document.querySelector('#ChangePassword .ChangePassword');
    const BackGroundBlur = document.querySelector('.BackGroundBlur');
    const emailError = document.querySelector('#ChangeEmail #ChangeEmailForm .ChangeEmail .EmailError');
    const passwordError = document.querySelector('#ChangeEmail #ChangeEmailForm .ChangeEmail .PasswordError');
    const emailButton = document.querySelector('#Settings .SettingsContainer .EmailButton');
    const passwordButton = document.querySelector('#Settings .SettingsContainer .PasswordButton');
    const confirmEmailChangeButton = document.querySelector('#ChangeEmail #ChangeEmailForm .ChangeEmail .ChangeEmailButton');
    const confirmPasswordChangeButton = document.querySelector('#ChangePassword #ChangePasswordForm .ChangePassword .ChangePasswordButton');

    if (window.location.href === 'http://localhost:3000/settings/account' || window.location.href === 'http://localhost:3000/settings/') {
        AccountText.style.color = '#1C1C1C';
        AccountText.style.borderBottom = '#128fdc 2px solid';

    } else if (window.location.href === 'http://localhost:3000/settings/profile') {
        ProfileText.style.color = '#1C1C1C';
        ProfileText.style.borderBottom = '#128fdc 2px solid';
    }

    fetch('/get-email', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.email) {
            emailText.innerHTML = data.email;
            UserEmail.placeholder = data.email;
            UserEmail.style.border = '2px solid #128fdc';
        } else {
            console.error('Failed to get email:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    if (emailButton) {
        emailButton.addEventListener('click', function() {
            if (ChangeEmail.style.display === 'block') {
                ChangeEmail.style.display = 'none';
                BackGroundBlur.style.display = 'none';
            } else {
                ChangeEmail.style.display = 'block';
                BackGroundBlur.style.display = 'block';
            }
        });
    }

    if (passwordButton) {
        passwordButton.addEventListener('click', function() {
            if (ChangePassword.style.display === 'block') {
                ChangePassword.style.display = 'none';
                BackGroundBlur.style.display = 'none';
            } else {
                ChangePassword.style.display = 'block';
                BackGroundBlur.style.display = 'block';
            }
        });
    }

    if (confirmPasswordChangeButton) {
        confirmPasswordChangeButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Confirm password change button clicked'); // Debugging line
            const emailValue = document.querySelector('#ChangePassword .Email').value.trim();
            const passwordValue = document.querySelector('#ChangePassword .Password').value.trim();
            const newPasswordValue = document.querySelector('#ChangePassword .NewPassword').value.trim();
            const emailError = document.querySelector('#ChangePassword .EmailErrorMessage');
            const passwordError = document.querySelector('#ChangePassword .PasswordErrorMessage');
            const newPasswordError = document.querySelector('#ChangePassword .NewPasswordErrorMessage');


            console.log('Email:', emailValue); // Debugging line
            console.log('Password:', passwordValue); // Debugging line
            console.log('New Password:', newPasswordValue); // Debugging line
            const data = { email: emailValue, password: passwordValue, newpassword: newPasswordValue };
 

            // Clear previous error messages
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            document.querySelector('#ChangePassword .Email').style.border = '';
            document.querySelector('#ChangePassword .Password').style.border = '';
            document.querySelector('#ChangePassword .NewPassword').style.border = '';

            let hasError = false;

            if (!emailValue) {
                emailError.style.display = 'block';
                emailError.innerHTML = 'Please enter your email';
                document.querySelector('#ChangePassword .Email').style.border = '2px solid red';
                hasError = true;
            }

            if (!passwordValue) {
                passwordError.style.display = 'block';
                passwordError.innerHTML = 'Please enter your current password';
                document.querySelector('#ChangePassword .Password').style.border = '2px solid red';
                hasError = true;
            }

            if (!newPasswordValue) {
                newPasswordError.style.display = 'block';
                newPasswordError.innerHTML = 'Please enter your new password';
                document.querySelector('#ChangePassword .NewPassword').style.border = '2px solid red';
                hasError = true;
            } else if (newPasswordValue.length < 8) {
                newPasswordError.style.display = 'block';
                newPasswordError.innerHTML = 'New password should have at least 8 characters';
                document.querySelector('#ChangePassword .NewPassword').style.border = '2px solid red';
                hasError = true;
            }

            if (hasError) {
                return;
            }


            fetch('/Change-Password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Ensure cookies are sent with the request
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data); // Debugging line

                if (data.errors) {
                    data.errors.forEach(error => {
                        console.log('Handling error:', error); // Debugging line

                        if (error.error === 'INVALID_EMAIL' || error.error === 'NO_EMAIL' || error.error === 'NOT_USERS_EMAIL') {
                            emailError.style.display = 'block';
                            emailError.innerHTML = error.message;
                            document.querySelector('#ChangePassword .Email').style.border = '2px solid red';
                        }
                        if (error.error === 'NO_PASSWORD' || error.error === 'INVALID_CREDENTIALS' || error.error === 'PASSWORD_SIZE') {
                            passwordError.style.display = 'block';
                            passwordError.innerHTML = error.message;
                            document.querySelector('#ChangePassword .Password').style.border = '2px solid red';
                        }
                        if (error.error === 'NO_NEW_PASSWORD' || error.error === 'SAME_PASSWORD') {
                            newPasswordError.style.display = 'block';
                            newPasswordError.innerHTML = error.message;
                            document.querySelector('#ChangePassword .NewPassword').style.border = '2px solid red';
                        }
                    });
                } else {
                    ChangeEmail.style.display = 'none';
                    ChangePassword.style.display = 'none';
                    BackGroundBlur.style.display = 'none';
                    emailError.style.display = 'none';
                    passwordError.style.display = 'none';
                    document.querySelector('#ChangePassword .Email').style.border = '';
                    document.querySelector('#ChangePassword .Password').style.border = '';
                    document.querySelector('#ChangePassword .NewPassword').style.border = '';

                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
    if (confirmEmailChangeButton) {
        confirmEmailChangeButton.addEventListener('click', function(event) {
            event.preventDefault();

            const emailValue = document.querySelector('#ChangeEmail #ChangeEmailForm .ChangeEmail .Email').value.trim();
            const passwordValue = document.querySelector('#ChangeEmail #ChangeEmailForm .ChangeEmail .Password').value.trim();
            const data = { email: emailValue, password: passwordValue };

            // Clear previous error messages
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            document.querySelector('#ChangeEmail .Email').style.border = '';
            document.querySelector('#ChangeEmail .Password').style.border = '';

            let hasError = false;

            if (!emailValue) {
                emailError.style.display = 'block';
                emailError.innerHTML = 'Please enter your new email';
                document.querySelector('#ChangeEmail .Email').style.border = '2px solid red';
                hasError = true;
            }

            if (!passwordValue) {
                passwordError.style.display = 'block';
                passwordError.innerHTML = 'Please enter your current password';
                document.querySelector('#ChangeEmail .Password').style.border = '2px solid red';
                hasError = true;
            }

            if (hasError) {
                return;
            }

            fetch('/Change-Email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Ensure cookies are sent with the request
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    data.errors.forEach(error => {
                        if (error.error === 'SAME_EMAIL' || error.error === 'NO_NEW_EMAIL' || error.error === 'EMAIL_NOT_FOUND' || error.error === 'EMAIL_ALREADY_EXISTS' || error.error === 'INVALID_EMAIL') {
                            emailError.style.display = 'block';
                            emailError.innerHTML = error.message;
                            document.querySelector('#ChangeEmail .Email').style.border = '2px solid red';
                        } else if (error.error === 'INVALID_CREDENTIALS' || error.error === 'NO_PASSWORD') {
                            passwordError.style.display = 'block';
                            passwordError.innerHTML = error.message;
                            document.querySelector('#ChangeEmail .Password').style.border = '2px solid red';
                        }
                    });
                } else {
                    ChangeEmail.style.display = 'none'
                    ChangePassword.style.display = 'none';
                    BackGroundBlur.style.display = 'none';
                    emailError.style.display = 'none';
                    passwordError.style.display = 'none';
                    document.querySelector('#ChangeEmail .Email').style.border = '';

                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});
//If User Already Logged then to not let him go to login or sign up
function ifUserAlreadyLogged(event) {
    event.preventDefault();
    fetch('/login', '/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if(data.errors) {
            data.erros.forEach(error => {
                if(error.error === 'ALREADY_LOGGED_IN' && window.location.href == '/login' || error.error === 'ALREADY_LOGGED_IN' && window.location.href == '/signup') {
                    window.location.href = '/home'
                }
            })
        }
    })
}
//Handle Login Errors
function handleLogin(event) {
    event.preventDefault();
    const emailValue = document.querySelector('.Email').value.trim();
    const passValue = document.querySelector('.Password').value.trim();
    const emailError = document.querySelector('.EmailError');
    const passwordError = document.querySelector('.PasswordError');

    const data = { email: emailValue, password: passValue };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        document.querySelector('.Email').style.border = '2px solid rgba(0, 0, 0, 0.2)';
        document.querySelector('.Password').style.border = '2px solid rgba(0, 0, 0, 0.2)';

        if (data.errors) {
            data.errors.forEach(error => {
                switch (error.error) {
                    case 'NO_PASSWORD':
                    case 'INVALID_PASSWORD':
                    case 'IP_MISMATCH':    
                        passwordError.style.display = 'block';
                        passwordError.innerHTML = error.message;
                        document.querySelector('.Password').style.border = '2px solid red';
                        break;
                    case 'NO_EMAIL':
                    case 'INVALID_EMAIL':
                    case 'EMAIL_NOT_FOUND':
                        emailError.style.display = 'block';
                        emailError.innerHTML = error.message;
                        document.querySelector('.Email').style.border = '2px solid red';
                        break; 
                    default:
                        console.error('Unknown error:', error);
                }
            });
        } else {
            window.location.href = '/home';
            console.log('Login successful');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

//Handle SignUp Errors
function handleRegistration(event) {
    event.preventDefault();
    const emailValue = document.querySelector('.Email-address').value.trim();
    const passValue = document.querySelector('.Password').value.trim();
    const emailError = document.querySelector('.EmailError');
    const passwordError = document.querySelector('.PasswordError');
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
                        document.querySelector('.Password').style.border = '2px solid red';
                    }
                    else if (error.error === 'NO_EMAIL') {
                        emailError.style.display = 'block';
                        emailError.innerHTML = error.message;
                        document.querySelector('.Email-address').style.border = '2px solid red';
                    }
                    else if (error.error === 'INVALID_PASSWORD') {
                        passwordError.style.display = 'block';
                        passwordError.innerHTML = error.message;
                        document.querySelector('.Password').style.border = '2px solid red';
                    }
                    else if (error.error === 'INVALID_EMAIL') {
                        emailError.style.display = 'block';
                        emailError.innerHTML = error.message;
                        document.querySelector('.Email-address').style.border = '2px solid red';
                    }
                    else if (error.error === 'EMAIL_ALREADY_EXISTS') {
                        emailError.style.display = 'block';
                        passwordError.style.display = 'none';
                        emailError.innerHTML = error.message;
                        document.querySelector('.Email-address').style.border = '2px solid red';
                        document.querySelector('.Password').style.border = '2px solid rgba(0, 0, 0, 0.2)';
                    }
            });
            
        } else {
            passwordError.style.display = 'none';
            emailError.style.display = 'none';
            document.querySelector('.Email-address').style.border = '2px solid rgba(0, 0, 0, 0.2)';
            document.querySelector('.Password').style.border = '2px solid rgba(0, 0, 0, 0.2)';
            window.location.href = '/home'
            console.log('Login successful');

        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
//Recover Password
function RecoverPassword(event) {
    event.preventDefault();
    const emailValue = document.querySelector('.Email').value.trim();
    const emailError = document.querySelector('.EmailError');

    emailError.style.display = 'none';
    emailError.innerHTML = '';
    document.querySelector('.Email').style.border = '';

    const data = { email: emailValue };

    fetch('/forgotpassword', {
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
                if (error.error === 'NO_EMAIL' || error.error === 'EMAIL_NOT_FOUND' || error.error === 'INVALID_EMAIL') {
                    emailError.style.display = 'block';
                    emailError.innerHTML = error.message;
                    document.querySelector('.Email').style.border = '2px solid red';
                    console.log('Error: ', error.message);  // Debugging log
                }
            });
        } else {
            console.log('Success: ', data.message);  // Debugging log
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


//Change profile pic
document.addEventListener('DOMContentLoaded', function() {
    const changeProfilePicButton = document.querySelector('#Settings .SettingsContainerProfile .DropImageButton .testbutton');
    const fileInput = document.querySelector('#Settings .SettingsContainerProfile .DropImageButton #fileInput');
    const profileImageElement = document.querySelector('#header .nav-list ul a #Circle');

    fetch('/get-user-id', {
        method: 'get',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        let userid = data.id;

        if (changeProfilePicButton && fileInput) {
            changeProfilePicButton.addEventListener('click', function() {
                fileInput.click();
            });

            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('profileImage', file);
                    formData.append('id', userid);

                    console.log('Uploading file:', file.name);

                    fetch('/upload-profile-image', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('File uploaded successfully');
                            profileImageElement.style.backgroundImage = `url(${data.filePath})`;
                            console.log('Profile image updated:', data.filePath);
                        } else {
                            alert('File upload failed');
                            console.error('Upload failed:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                        alert('An error occurred while uploading the file');
                    });
                }
            });
        }
    })
    .catch(error => {
        console.error('Error fetching user ID:', error);
    });
});


//Menu 
const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');
const hamburgerButton = document.querySelector('#header .nav-list .hamburger');
const brandSpans = document.querySelectorAll('.brand h1 span');

hamburgerButton.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
    if (mobile_menu.classList.contains(
        
        'active')) {
        mobile_menu.querySelectorAll('a').forEach(item => {
            item.style.color = 'white';
        });
        brandSpans.forEach(span => {
            span.style.color = 'white';
        });
//para o meu do future é necessario adicionar uma funçao para se o tamanho da pagina
//google for maior do que x as cores voltarem ao normal
    } else {
        mobile_menu.querySelectorAll('a').forEach(item => {
            item.style.color = '';
        });
        brandSpans.forEach(span => {
            span.style.color = '';
        });

    }
});

menu_item.forEach((item) => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobile_menu.classList.remove('active');
        
        mobile_menu.querySelectorAll('a').forEach(link => {
            link.style.color = '';
        });
    });
});

    


        