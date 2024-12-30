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
        console.log('User is logged in. Modifying the DOM accordingly.');

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
                    console.log(data.message);
                    // Redirect the user to the login page or home page
                    window.location.href = '/login';
                })
                .catch((error) => console.error('Error:', error));
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
   //Dark mode logic
   const header = document.getElementById('header');
   const logoSpan = document.querySelector('#header .Logo h1');
   const mainRoutes = document.querySelectorAll('#header .MainRoutes ul a');
   const authLinks = document.querySelectorAll('#header .Auth ul a');
   const h1 = document.querySelector('#Settings h1')
   const settingUl = document.querySelectorAll('#Settings ul li a ')
   const h2 = document.querySelector('.h2Title')
   const h3 = document.querySelectorAll('#Settings h3')
   const span = document.querySelector('#Settings span')
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
                      document.querySelector('.h2Title').style.color = '#128fdc'
           h2.style.color = '#128fdc'
           span.style.color = '#e0e0e0'
       } else {
           document.body.style.backgroundColor = '';
           header.style.backgroundColor = '';
           if (logoSpan) logoSpan.style.color = '';
           mainRoutes.forEach(link => link.style.color = '');
           authLinks.forEach(link => link.style.color = '');
           h1.style.color = ''
           settingUl.forEach(a => a.style.color ='')
           h3.forEach(h3 => h3.style.color ='')
           span.style.color = ''
        
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
    const currentUserName = document.querySelector('#Settings .UserName p');
    const changeNameButton = document.querySelector('.ProfileSettings .UserName button')
    const userInputField = document.querySelector('.ProfileSettings .UserName input');
    fetch('/UserInfo', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUserName.innerHTML = `Your current name: <strong style="color: black;">${data.UserName}</strong>`;
        } else {
            console.error('Failed to fetch user info:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    function updateButtonState() {
        const userInput = userInputField.value;
        if (userInput.length >= 1) {
            changeNameButton.style.opacity = '1'; 
            changeNameButton.style.cursor = 'pointer';
        } else {
            changeNameButton.style.opacity = '0.35';
            changeNameButton.style.cursor = 'not-allowed';
        }
    }

    // Initial check on load
    updateButtonState();

    // Check input value on each keyup event
    userInputField.addEventListener('input', updateButtonState);

    // Button click event
    changeNameButton.addEventListener('click', function() {
        const userInput = userInputField.value;
        const data = {name: userInput}
        if (userInput.length <= 11) {
            fetch('/ChangeUserName', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    userInputField.value = '';

                    currentUserName.innerHTML = `Your current name: <strong style="color: black;">${userInput}</strong>`;
                }
             })
        } else {
            currentUserName.style.color = 'red'
            currentUserName.style.fontWeight = 'bold'
            currentUserName.innerHTML = 'Please choose a name smaller than 11 characters'
            userInputField.style.border = '2px solid red'
        }
    });
    
});

document.querySelector('.DropImageButton #fileInput').addEventListener('change', function(event) {
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
                document.querySelector('.img #fileInput').addEventListener('change', function(event) {
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
.catch(error => console.error('Error fetching user info:', error));
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

