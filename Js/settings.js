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

document.addEventListener('DOMContentLoaded', function() {
    updateUserPhotoLink()
     //If user is Logged In then show the Profile Menu and remove the register / login
    
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
    //Handle Profile Menu

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
    window.addEventListener('click', (event) => {
        if (CircleButton && !CircleButton.contains(event.target)) {
            DropDownMenu.style.display = 'none';
        }
        
    });
    if (SignOutButton) {
        SignOutButton.addEventListener('click', function() {
            // Clear cookies
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            fetch('/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                // Redirect the user to the login page 
                window.location.href = '/login';
            })
            .catch(error => console.error('Error:', error));
        });
    }
    /* Handle Settings customization */
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
            //Closing 
            if (ChangeEmail.style.display === 'block') {
                ChangeEmail.style.display = 'none';
                BackGroundBlur.style.display = 'none';
            }
            //open menu 
            else {
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
                console.log('Response from server:', data);

                if (data.errors) {
                    data.errors.forEach(error => {
                        console.log('Handling error:', error); 

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
            // Change Email
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
     //Darkmode settings account

     const DarkModeButton = document.querySelector('#DarkMode');
     const brandSpans = document.querySelectorAll('.brand h1 span');
     const headerLinks = document.querySelectorAll('#header .nav-list ul a');
     const settingsLi = document.querySelectorAll('#Settings ul li a');
     const settingsH2 = document.querySelectorAll('#Settings h2');
     const settingsH3 = document.querySelectorAll('#Settings h3');
     const settingsP = document.querySelectorAll('#Settings p');
 
     function applyDarkModeStyles() {
         document.body.classList.add('dark-mode');
         document.body.style.backgroundColor = '#121212';
         document.querySelector('#Settings h1').style.color = '#489be0';
         document.querySelector('#Settings .JoinGoogle').style.color = 'red';
         brandSpans.forEach(span => {
             span.style.color = '#9acdec';
         });
         document.querySelector('#header').style.backgroundColor = '#121212';
         headerLinks.forEach(link => {
             link.style.color = '#489be0';
         });
         settingsLi.forEach(li => {
             li.style.color = '#9acdec';
         });
         settingsH2.forEach(h2 => {
             h2.style.color = '#489be0';
         });
         settingsH3.forEach(h3 => {
             h3.style.color = '#9acdec';
         });
         settingsP.forEach(p => {
             p.style.color = 'red';
         });
     }
 
     function clearDarkModeStyles() {
         document.body.classList.remove('dark-mode');
         document.body.style.backgroundColor = '';
         document.querySelector('#Settings h1').style.color = '';
         document.querySelector('#Settings .JoinGoogle').style.color = '';
         brandSpans.forEach(span => {
             span.style.color = '';
         });
         document.querySelector('#header').style.backgroundColor = '';
         headerLinks.forEach(link => {
             link.style.color = '';
         });
         settingsLi.forEach(li => {
             li.style.color = '';
         });
         settingsH2.forEach(h2 => {
             h2.style.color = '';
         });
         settingsH3.forEach(h3 => {
             h3.style.color = '';
         });
         settingsP.forEach(p => {
             p.style.color = '';
         });
     }
 
     function applyDarkMode(isDarkMode) {
         if (isDarkMode) {
             applyDarkModeStyles();
         } else {
             clearDarkModeStyles();
         }
     }
 
     fetch('/darkmode', {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json'
         }
     }).then(response => response.json())
     .then(data => {
         console.log('Dark mode preference from server:', data.darkMode);
         if (data.darkMode) {
             applyDarkMode(true);
         }
 
         if (DarkModeButton) {
             DarkModeButton.addEventListener('click', function(event) {
                 event.preventDefault();
                 const isDarkMode = !document.body.classList.contains('dark-mode');
                 console.log('Toggling dark mode to:', isDarkMode);
                 applyDarkMode(isDarkMode);
                 setDarkModePreference(isDarkMode);
             });
         }
     })
     .catch(error => console.error('Error fetching dark mode preference:', error));
 
     function setDarkModePreference(isDarkMode) {
         fetch('/darkmode', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ darkMode: isDarkMode })
         })
         .then(response => {
             if (response.ok) {
                 console.log('Dark mode preference saved successfully.');
             } else {
                 console.error('Failed to save dark mode preference.');
             }
         })
         .catch(error => console.error('Error saving dark mode preference:', error));
     }
 
     function clearDarkModePreference() {
         fetch('/cleardarkmode', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             }
         })
         .then(response => {
             if (response.ok) {
                 console.log('Dark mode preference cleared successfully.');
             } else {
                 console.error('Failed to clear dark mode preference.');
             }
         })
         .catch(error => console.error('Error clearing dark mode preference:', error));
     }
});
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
        const circleElement = document.getElementById('Circle');
        if (data.success) {
            if (data.photoLink) {
                const photoUrl = `/uploads/${data.photoLink}`;
                circleElement.style.backgroundImage = `url(${photoUrl})`;
            } 
        } 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update photo link');
    });
}
