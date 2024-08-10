

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
        LoginElement.innerHTML = 'Settings';
        LoginElement.href = '/Settings';
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
     //Dark mode logic
     const header = document.getElementById('header');
     const logoSpan = document.querySelector('#header .Logo h1');
     const mainRoutes = document.querySelectorAll('#header .MainRoutes ul a');
     const authLinks = document.querySelectorAll('#header .Auth ul a');
    
     function applyDarkMode(isDarkMode) {
         if (isDarkMode) {
             document.body.style.backgroundColor = '#121212';
             header.style.backgroundColor = '#121212';
             if (logoSpan) logoSpan.style.color = '#128fdc';
             mainRoutes.forEach(link => link.style.color = '#128fdc');
             authLinks.forEach(link => link.style.color = '#128fdc');
            
         } else {
             document.body.style.backgroundColor = '';
             header.style.backgroundColor = '';
             if (logoSpan) logoSpan.style.color = '';
             mainRoutes.forEach(link => link.style.color = '');
             authLinks.forEach(link => link.style.color = '');
            
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

    /* Get Started Not using right now 
    const GetStarted = document.querySelector('#GetStarted')
    const subjectInput = document.querySelector('.UserInput .Subject');
    const dropdown = document.querySelector('.UserInput .dropdown');
    const options = document.querySelectorAll('.UserInput .dropdown .option');
    const userImage = document.querySelector('.UserInput .usericon');
    const MoreInfo = document.querySelector('.GiveMoreInfo');
    const startButton = document.querySelector('.GetStartedButton');
    const giveInfo = document.querySelector('.a');
    const errormessage = document.querySelector('.UserInput .ErrorMessage');
    const subInfo = document.querySelector('.UserInput .SubInfo .SubInfoText');
    const addSubject = document.querySelector('#AddSubject .AddSubject')
    fetch('/CheckFirstTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Usersubjects: subjectInput.value }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.responseMessage) {
            data.responseMessage.forEach(error => { 
                if (error.error === 'ID_NOT_FOUND') {
                    GetStarted.style.display = 'block';
                    subjectInput.addEventListener('focus', () => {
                        dropdown.style.display = 'block';
                    });
                
                    subjectInput.addEventListener('click', () => {
                        dropdown.style.display = 'block';
                    });
                    if (window.innerWidth < 768 && subjectInput.value) { 
                        document.querySelector('.Pooh img').style.top = '100%';
                    }
                    options.forEach(option => {
                        option.addEventListener('click', () => {
                            subjectInput.value = option.textContent;
                            dropdown.style.display = 'none';
                            if(subjectInput.value) {
                               userImage.style.top = '31%';
                               document.querySelector('.Pooh img').style.top = '12%';
                               document.querySelector('.UserInput .SubInfo .a213').style.display = 'block';
                               document.querySelector('.a .pooh').style.top = '46%';
                               giveInfo.style.display = 'block';
                               subInfo.style.display = 'block';
                               MoreInfo.innerHTML = `You chose ${option.textContent}. Can you specify the topic? For example, if it's History, which part (e.g., WW2)?`;
                               subjectInput.style.border = '';
                               errormessage.style.display = '';
                               dropdown.style.top = '45%';
                            }
                        });
                    });
                    
                    startButton.addEventListener('click', () => {
                        if (!subjectInput.value) {
                            subjectInput.style.border = '2px solid red';
                            errormessage.style.display = 'block';
                        } else {
                            fetch('/PutUserOnTable', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ Usersubjects: subjectInput.value }), // Update this line to send Usersubject
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.errors) {
                                    data.errors.forEach(error => { 
                                        if(error.error === 'ADDED_ID') {
                                            subjectInput.style.border = '';
                                            errormessage.style.display = '';
                                            GetStarted.style.display = 'none';
                                        }
                                    })
                                } 
                            })    
                          .catch(error => console.error('Error checking first time:', error));
                        }
                    });
                
                    document.addEventListener('click', (event) => {
                        if (!event.target.closest('.UserInput')) {
                            dropdown.style.display = 'none';
                        }
                    });
                }
                if(error.error === 'ID_FOUND') {
                    subjectInput.style.border = '';
                    errormessage.style.display = '';
                    addSubject.style.display = 'block'
                    GetStarted.style.display = 'none';
                    document.querySelector('#MainContent .card').style.display = 'block'

                }
            });
        } 
    })
    .catch(error => console.error('Error checking first time:', error));
    fetch('/CheckUserLanguage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies in the request
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.responseMessage && data.responseMessage.length > 0) {
            data.responseMessage.forEach(message => {
                if (message.error === 'USER_PREFERS_PORTUGUESE') { 
                    document.querySelector('.Pooh p').innerHTML = 'Qual assunto gostarias de aprender?';
                    document.querySelector('.StartBox h1').innerHTML = 'Vamos começar';
                    document.querySelector('.UserInput input').placeholder = 'Escolha o assunto';
                    document.querySelector('.GetStartedButton').innerHTML = 'Aprenda agora';
                    document.querySelector('.GetStartedButton').style.fontSize = '13px';
                    const inputBox = document.querySelector('.UserInput input')
                    const dropdownPt = document.querySelector('.UserInput .dropdownPt')
                    const optionsPt = document.querySelectorAll('.UserInput .dropdownPt .option');

                    subjectInput.addEventListener('focus', () => {
                        dropdownPt.style.display = 'block';
                        dropdown.style.display = 'none'
                    });
                
                    subjectInput.addEventListener('click', () => {
                        dropdownPt.style.display = 'block';
                        dropdown.style.display = 'none'

                    });
                    if (window.innerWidth < 768 && subjectInput.value) { 
                        document.querySelector('.Pooh img').style.top = '100%';
                    }
                    optionsPt.forEach(option => {
                        option.addEventListener('click', () => {
                            subjectInput.value = option.textContent;
                            dropdown.style.display = 'none';
                            if(subjectInput.value) {
                               userImage.style.top = '31%';
                               document.querySelector('.Pooh img').style.top = '12%';
                               document.querySelector('.UserInput .SubInfo .a213').style.display = 'block';
                               document.querySelector('.a .pooh').style.top = '46%';
                               giveInfo.style.display = 'block';
                               subInfo.style.display = 'block';
                               MoreInfo.innerHTML = `Escolheste ${option.textContent}. Podes especificar o tópico? Por exemplo, se for História, qual parte (ex.: 2ª Guerra Mundial)?`;
                               document.querySelector('.UserInput .SubInfoText').placeholder = 'Conte-nos o seu interese (opcional)'
                               subjectInput.style.border = '';
                               errormessage.style.display = '';
                               dropdownPt.style.top = '45%';
                               dropdownPt.style.display = 'none';
                            }
                        });
                    });

                    startButton.addEventListener('click', () => {
                        if (!subjectInput.value) {
                            subjectInput.style.border = '2px solid red';
                            errormessage.style.display = 'block';
                            errormessage.innerHTML = 'Selecione pelo menos 1 assunto'
                       
                        } 
                    });
                
                
                    document.addEventListener('click', (event) => {
                        if (!event.target.closest('.UserInput')) {
                            dropdown.style.display = 'none';
                        }
                    });
                }
            });
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
    startButton.addEventListener('click', () => {
        if (subjectInput.value) {
            document.querySelector('.card').style.display = 'block'
            addSubject.style.display = 'block'
            subjectInput.style.border = '';
            errormessage.style.display = '';
            GetStarted.style.display = 'none';
            document.querySelector('#MainContent .card').style.display = 'block'

        }
    })    
    const dropdownPt = document.querySelector('.UserInput .dropdownPt')

    window.addEventListener('click', (event) => {
        if (dropdownPt && !dropdownPt.contains(event.target) && !subjectInput.contains(event.target)) {
            dropdownPt.style.display = 'none';
        }
        if (dropdown && !dropdown.contains(event.target) && !subjectInput.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
    */
});


/* 
document.addEventListener('DOMContentLoaded', function() {
    const addSubject = document.querySelector('#AddSubject .AddSubject')
    const closeSubject = document.querySelector('.CloseButton')
    const GetStarted = document.querySelector('#GetStarted')
    const subjectInput = document.querySelector('.UserInput .Subject');
    const dropdown = document.querySelector('.UserInput .dropdown');
    const options = document.querySelectorAll('.UserInput .dropdown .option');
    const dropdownPt = document.querySelector('.UserInput .dropdownPt')
    const optionsPt = document.querySelectorAll('.UserInput .dropdownPt .option');
    const userImage = document.querySelector('.UserInput .usericon');
    const MoreInfo = document.querySelector('.GiveMoreInfo');
    const startButton = document.querySelector('.GetStartedButton');
    const giveInfo = document.querySelector('.a');
    const errormessage = document.querySelector('.UserInput .ErrorMessage');
    const subInfo = document.querySelector('.UserInput .SubInfo .SubInfoText');
    addSubject.addEventListener('click', function(){
        if(closeSubject) {
            closeSubject.addEventListener('click', function() {
                GetStarted.style.display = 'none'
                addSubject.style.display = 'block'
                document.querySelector('#MainContent .card').style.display = 'block'
                location.reload()
            })
        }
       
        fetch('/CheckUserLanguage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include cookies in the request
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.responseMessage && data.responseMessage.length > 0) {
                data.responseMessage.forEach(message => {
                    if (message.error === 'USER_PREFERS_ENGLISH') {
                        document.querySelector('.card').style.display = 'none'
                        addSubject.style.display = 'none'
                        GetStarted.style.display = 'block';
                        
                        subjectInput.addEventListener('focus', () => {
                            dropdown.style.display = 'block';
                        });
                    
                        subjectInput.addEventListener('click', () => {
                            dropdown.style.display = 'block';
                        });
                        if (window.innerWidth < 768 && subjectInput.value) { 
                            document.querySelector('.Pooh img').style.top = '100%';
                        }
                        options.forEach(option => {
                            option.addEventListener('click', () => {
                                subjectInput.value = option.textContent;
                                dropdown.style.display = 'none';
                                if(subjectInput.value) {
                                   userImage.style.top = '31%';
                                   document.querySelector('.Pooh img').style.top = '12%';
                                   document.querySelector('.UserInput .SubInfo .a213').style.display = 'block';
                                   document.querySelector('.a .pooh').style.top = '46%';
                                   giveInfo.style.display = 'block';
                                   subInfo.style.display = 'block';
                                   MoreInfo.innerHTML = `You chose ${option.textContent}. Can you specify the topic? For example, if it's History, which part (e.g., WW2)?`;
                                   subjectInput.style.border = '';
                                   errormessage.style.display = '';
                                   dropdown.style.top = '45%';
                                }
                            });
                        });
                        
                    }
                    else if (message.error === 'USER_PREFERS_PORTUGUESE') { 
                        GetStarted.style.display = 'block'
                        document.querySelector('.card').style.display = 'none'
                        addSubject.style.display = 'none'
                        document.querySelector('.Pooh p').innerHTML = 'Qual assunto gostarias de aprender?';
                        document.querySelector('.StartBox h1').innerHTML = 'Vamos começar';
                        document.querySelector('.UserInput input').placeholder = 'Escolha o assunto';
                        document.querySelector('.GetStartedButton').innerHTML = 'Aprenda agora';
                        document.querySelector('.GetStartedButton').style.fontSize = '13px';
                        const inputBox = document.querySelector('.UserInput input')
                        const dropdownPt = document.querySelector('.UserInput .dropdownPt')
                        const optionsPt = document.querySelectorAll('.UserInput .dropdownPt .option');
    
                        subjectInput.addEventListener('focus', () => {
                            dropdownPt.style.display = 'block';
                            dropdown.style.display = 'none'
                        });
                    
                        subjectInput.addEventListener('click', () => {
                            dropdownPt.style.display = 'block';
                            dropdown.style.display = 'none'
    
                        });
                        if (window.innerWidth < 768 && subjectInput.value) { 
                            document.querySelector('.Pooh img').style.top = '100%';
                        }
                        optionsPt.forEach(option => {
                            option.addEventListener('click', () => {
                                subjectInput.value = option.textContent;
                                dropdown.style.display = 'none';
                                if(subjectInput.value) {
                                   userImage.style.top = '31%';
                                   document.querySelector('.Pooh img').style.top = '12%';
                                   document.querySelector('.UserInput .SubInfo .a213').style.display = 'block';
                                   document.querySelector('.a .pooh').style.top = '46%';
                                   giveInfo.style.display = 'block';
                                   subInfo.style.display = 'block';
                                   MoreInfo.innerHTML = `Escolheste ${option.textContent}. Podes especificar o tópico? Por exemplo, se for História, qual parte (ex.: 2ª Guerra Mundial)?`;
                                   document.querySelector('.UserInput .SubInfoText').placeholder = 'Conte-nos o seu interese (opcional)'
                                   subjectInput.style.border = '';
                                   errormessage.style.display = '';
                                   dropdownPt.style.top = '45%';
                                   dropdownPt.style.display = 'none';
                                }
                            });
                        });
    
                        
                    
                        document.addEventListener('click', (event) => {
                            if (!event.target.closest('.UserInput')) {
                                dropdown.style.display = 'none';
                            }
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
        startButton.addEventListener('click', () => {
            if(!subjectInput.value) {
                
                    subjectInput.style.border = '2px solid red';
                    errormessage.style.display = 'block';
                    errormessage.innerHTML = 'Selecione pelo menos 1 assunto'
            }
            else if (subjectInput.value) {
                document.querySelector('.card').style.display = 'block'
                addSubject.style.display = 'block'
                subjectInput.style.border = '';
                errormessage.style.display = '';
                GetStarted.style.display = 'none';
                document.querySelector('#MainContent .card').style.display = 'block'
                fetch('/PutUserOnTable', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Usersubjects: subjectInput.value }), // Update this line to send Usersubject
                })
                .then(response => response.json())
                .then(data => {
                    if (data.errors) {
                        data.errors.forEach(error => { 
                            if(error.error === 'ADDED_ID') {
                                subjectInput.style.border = '';
                                errormessage.style.display = '';
                                GetStarted.style.display = 'none';
                                location.reload()

                            }
                        })
                    } 
                })    
                .catch(error => console.error('Error checking first time:', error));
            }
        })    
    })
    
})
*/
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
