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
                                alert('UserAdded')
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