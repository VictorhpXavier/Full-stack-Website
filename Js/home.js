const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');
const hamburgerButton = document.querySelector('#header .nav-list .hamburger');
const brandSpans = document.querySelectorAll('.brand h1 span');

hamburgerButton.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
    if (mobile_menu.classList.contains('active')) {
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
//Check User language preference
document.addEventListener('DOMContentLoaded', function() {
    const languageButton = document.querySelector('#footer .Country-Flag ')
    const options = document.querySelectorAll('#footer .dropdown .option');
    const ChooseLangue = document.querySelector('#footer .dropdown ')


    if(languageButton) {
        languageButton.addEventListener('click', function() {
            if(ChooseLangue.style.display === 'none' || ChooseLangue.style.display === '') {
                ChooseLangue.style.display = 'block'
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        if(option) {
                            alert(option.textContent)
                            fetch('/checkuserlanguage', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify( { language : option.textContent}),
                            })
                            .then(response => response.json())
                            .then(data => { 
                                if(data.responseMessage) {
                                    data.responseMessage.forEach(error => {
                                        if(error.error === 'CHANGE_TO_ENGLISH') {
                                            alert('Changing language to english')
                                        }else if (error.error === 'CHANGE_TO_PORTUGUESE') {
                                            alert('Changing to portuguese')
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }else {
                ChooseLangue.style.display = ''

            }
        })
    }
   
    
})



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
        document.querySelector('.FreeSignUp-Button').style.display = 'none'

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
    const DarkModeButton = document.querySelector('#DarkMode');
    const brandSpans = document.querySelectorAll('.brand h1 span');
    const headerLinks = document.querySelectorAll('#header .nav-list ul a')
    const mainthemeH1 = document.querySelectorAll('#MainTheme h1')
    const mainthemeP = document.querySelector('#MainTheme p')
    const servicesH3 = document.querySelectorAll('#Services h3')
    const servicesP = document.querySelectorAll('#Services p')
    const features = document.querySelectorAll('#Services .feature')
    const footer = document.querySelector('#footer')
    const footerbutton = document.querySelectorAll('#footer button')

    function applyDarkMode(isDarkMode) {
        if (isDarkMode) {
            if (document.body.style.backgroundColor === 'rgb(208, 236, 253)' || document.body.style.backgroundColor === '') {
                document.body.style.backgroundColor = '#121212';
                brandSpans.forEach(span => {
                    span.style.color = '#9acdec';
                });
                document.querySelector('#header').style.backgroundColor = '#121212'
                headerLinks.forEach(link => {
                    link.style.color = '#489be0'
                })
                mainthemeH1.forEach(h1 => {
                    h1.style.color = '#8f9195'
                })
                servicesH3.forEach(h3 => {
                    h3.style.color = '#489be0'
                })
                servicesP.forEach(p => {
                    p.style.color = '#97bfec'
                })
                features.forEach(feature => {
                    feature.style.backgroundColor = '#282828'
                    
                })
                footerbutton.forEach(button => {
                    button.style.color = 'white'
                })
                document.querySelector('#footer button').style.color = 'white'
                document.querySelector('#footer .Li-Language').style.color = 'white'
                footer.style.color = 'white'
                footer.style.backgroundColor = '#575757'
                mainthemeP.style.color = '#717171'
            } else {
                clearDarkModePreference();
                document.body.style.backgroundColor = '';
                brandSpans.forEach(span => {
                    span.style.color = '';
                });
                document.querySelector('#header').style.backgroundColor = ''
                headerLinks.forEach(link => {
                    link.style.color = ''
                })
                mainthemeH1.forEach(h1 => {
                    h1.style.color = ''
                })
                servicesH3.forEach(h3 => {
                    h3.style.color = ''
                })
                servicesP.forEach(p => {
                    p.style.color = ''
                })
                features.forEach(feature => {
                    feature.style.backgroundColor = ''
                    
                })
                document.querySelector('#footer button').style.color = ''
                document.querySelector('#footer .Li-Language').style.color = ''
                footer.style.color = ''
                footer.style.backgroundColor = ''
                document.querySelector('#Services-Class h1').style.color = ''
               mainthemeP.style.color = ''
            }
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

