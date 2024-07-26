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
    //ChangeProfile Pic
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
    //Handle Style customization

    const AccountText = document.querySelector('#Settings .SettingsContainer .SettingUl .Account');
    const ProfileText = document.querySelector('#Settings .SettingsContainerProfile .SettingUl .Profile');
   

    if (window.location.href === 'http://localhost:3000/settings/account' ) {
        AccountText.style.color = '#1C1C1C';
        AccountText.style.borderBottom = '#128fdc 2px solid';

    } else if (window.location.href === 'http://localhost:3000/settings/profile') {
        ProfileText.style.color = '#1C1C1C';
        ProfileText.style.borderBottom = '#128fdc 2px solid';
    }
    //Handle DarkMode
    const DarkModeButton = document.querySelector('#DarkMode');
    const brandSpans = document.querySelectorAll('.brand h1 span');
    const headerLinks = document.querySelectorAll('#header .nav-list ul a');
    const settingsLi = document.querySelectorAll('#Settings ul li a');
    const settingsH2 = document.querySelectorAll('#Settings h2');
    const settingsH3 = document.querySelectorAll('#Settings h3');

    function applyDarkModeStyles() {
        document.body.style.backgroundColor = '#121212';
        document.querySelector('#Settings h1').style.color = '#489be0';
        document.querySelector('#Settings span').style.color = '#9acdec';
        document.querySelector('#header').style.backgroundColor = '#121212';
        brandSpans.forEach(span => {
            span.style.color = '#9acdec';
        });
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
    }

    function clearDarkModeStyles() {
        document.body.style.backgroundColor = '';
        document.querySelector('#Settings h1').style.color = '';
        document.querySelector('#Settings span').style.color = '';
        document.querySelector('#header').style.backgroundColor = '';
        brandSpans.forEach(span => {
            span.style.color = '';
        });
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
    }

    function applyDarkMode(isDarkMode) {
        if (isDarkMode) {
            applyDarkModeStyles();
            document.body.classList.add('dark-mode');
        } else {
            clearDarkModeStyles();
            document.body.classList.remove('dark-mode');
        }
    }

    // Fetch the dark mode preference from the backend
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
        circleElement.style.backgroundImage = `url('../UserIcon/UnkwonUser.png')`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
