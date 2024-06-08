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
})

//DarkMode Settings Account
document.addEventListener('DOMContentLoaded', function() {
    const DarkModeButton = document.querySelector('#DarkMode');
    const brandSpans = document.querySelectorAll('.brand h1 span');
    const headerLinks = document.querySelectorAll('#header .nav-list ul a')
    const settingsLi = document.querySelectorAll('#Settings ul li a')
    const settingsH2 = document.querySelectorAll('#Settings h2')
    const settingsH3 = document.querySelectorAll('#Settings h3')
    if (DarkModeButton) {
        DarkModeButton.addEventListener('click', function(event) {
            event.preventDefault();
            if (document.body.style.backgroundColor === 'rgb(179, 0, 255)' || document.body.style.backgroundColor === '') {
                document.body.style.backgroundColor = '#121212';
                document.querySelector('#Settings h1').style.color = '#489be0'
                document.querySelector('#Settings span').style.color = '#9acdec'
                document.querySelector('#header').style.backgroundColor = '#121212'
                brandSpans.forEach(span => {
                    span.style.color = '#9acdec';
                });
                headerLinks.forEach(link => {
                    link.style.color = '#489be0'
                })
                settingsLi.forEach(li => {
                    li.style.color = '#9acdec'
                })
                settingsH2.forEach(h2 => {
                    h2.style.color = '#489be0'
                })
                settingsH3.forEach(h3 => {
                    h3.style.color = '#9acdec'
                })

            } else {
                 
                document.body.style.backgroundColor = '';
                document.querySelector('#Settings h1').style.color = ''
                document.querySelector('#Settings span').style.color = ''
                document.querySelector('#header').style.backgroundColor = ''
                brandSpans.forEach(span => {
                    span.style.color = '';
                });
                headerLinks.forEach(link => {
                    link.style.color = ''
                })
                settingsLi.forEach(li => {
                    li.style.color = ''
                })
                settingsH2.forEach(h2 => {
                    h2.style.color = ''
                })
                settingsH3.forEach(h3 => {
                    h3.style.color = ''
                })
                
            }
        });
    }
})