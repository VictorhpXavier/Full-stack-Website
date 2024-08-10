const deleteAccountButton = document.querySelector ('.DangerZone .DeleteAccount')
deleteAccountButton.addEventListener('click', function() {
    const deleteChatMenu = document.querySelector('.Delete-Chat');
    const overlayEffect = document.querySelector('#overlay');
    const confirmationInput = document.querySelector('#Settings .Delete-Chat input');
    const deleteAccount = document.querySelector('#Settings .Delete-Chat button')
    function deleteChat() {
        fetch('/DeleteAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => { 
            if (data.success) {
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
                    // Redirect the user to the login page 
                    window.location.href = '/home';
                })
                .catch(error => console.error('Error:', error));
            }    
               
    })
    }
    
    
 
    deleteChatMenu.style.display = 'block';
    overlayEffect.style.display = 'block';
    function updateDeleteButton() {
        if (confirmationInput.value === 'Delete Account') {
            deleteAccount.style.opacity = '100%';
            deleteAccount.style.cursor = 'pointer';
            deleteAccount.addEventListener('click', deleteChat); // Add event listener to allow action
        } else {
            deleteAccount.style.opacity = '35%';
            deleteAccount.style.cursor = 'not-allowed';
            deleteAccount.removeEventListener('click', deleteChat); // Remove event listener to prevent action
        }
    }
    confirmationInput.addEventListener('input', (event) => {
        updateDeleteButton();
    });

    updateDeleteButton();
    document.querySelector('.Delete-Chat .close-btn').addEventListener('click', function() {
        const deleteChatMenu = document.querySelector('.Delete-Chat');
        const overlayEffect = document.querySelector('#overlay');
        
        deleteChatMenu.style.display = 'none';
        overlayEffect.style.display = 'none';
    });
    deleteAccount.addEventListener('click', function() {
        deleteChat()
    })
})
document.addEventListener('DOMContentLoaded', function() {
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

        LoginElement.style.marginTop = '100px'
        LoginElement.innerHTML = 'WorkSpace';
        LoginElement.href = '/Workspace';
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
                    // Redirect the user to the login page or home page
                    window.location.href = '/login';
                })
                .catch((error) => console.error('Error:', error));
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
            const emailValue = document.querySelector('#ChangePassword .Email').value.trim();
            const passwordValue = document.querySelector('#ChangePassword .Password').value.trim();
            const newPasswordValue = document.querySelector('#ChangePassword .NewPassword').value.trim();
            const emailError = document.querySelector('#ChangePassword .EmailErrorMessage');
            const passwordError = document.querySelector('#ChangePassword .PasswordErrorMessage');
            const newPasswordError = document.querySelector('#ChangePassword .NewPasswordErrorMessage');

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
                if (data.errors) {
                    data.errors.forEach(error => {

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

    //Dark mode logic
    const header = document.getElementById('header');
    const logoSpan = document.querySelector('#header .Logo h1');
    const mainRoutes = document.querySelectorAll('#header .MainRoutes ul a');
    const authLinks = document.querySelectorAll('#header .Auth ul a');
    const h1 = document.querySelector('#Settings h1')
    const settingUl = document.querySelectorAll('#Settings ul li a ')
    const h2 = document.querySelector('.SettingsTitle')
    const h3 = document.querySelectorAll('#Settings h3')
    const deleteAccount = document.querySelector('#Settings .DangerZone h3')
    const p = document.querySelectorAll('#Settings p')
    const googleSpan = document.querySelector('#Settings .JoinGoogle span')
    const singInGoogle = document.querySelector('#Settings .JoinGoogle img')
    function applyDarkMode(isDarkMode) {
        if (isDarkMode) {
            document.body.style.backgroundColor = '#121212';
            header.style.backgroundColor = '#121212';
            if (logoSpan) logoSpan.style.color = '#128fdc';
            mainRoutes.forEach(link => link.style.color = '#128fdc');
            authLinks.forEach(link => link.style.color = '#128fdc');
            h1.style.color = '#128fdc'
            settingUl.forEach(a => a.style.color ='#e0e0e0')
            h3.forEach(h3 => h3.style.color ='#128fdc')
            deleteAccount.style.color ='red'
            p.forEach(p => p.style.color ='#e0e0e0')
            googleSpan.style.color ='#e0e0e0'
            singInGoogle.src = '../UserIcon/web_dark_rd_SI.svg'

        } else {
            document.body.style.backgroundColor = '';
            header.style.backgroundColor = '';
            if (logoSpan) logoSpan.style.color = '';
            mainRoutes.forEach(link => link.style.color = '');
            authLinks.forEach(link => link.style.color = '');
            h1.style.color = ''
            settingUl.forEach(a => a.style.color ='')
            h3.forEach(h3 => h3.style.color ='')
            deleteAccount.style.color =''
            p.forEach(p => p.style.color ='')
            googleSpan.style.color =''
            singInGoogle.src = '../UserIcon/web_neutral_rd_SI.svg'
         
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

