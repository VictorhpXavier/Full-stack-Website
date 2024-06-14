
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.Login-Button').addEventListener('click', handleLogin);
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.Sign-up .Sign-Up-button').addEventListener('click', handleRegistration); 
})


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.about-button').addEventListener('click', rollOver);
})

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



//If User Already Logged then to not let him go to login or sign up
function ifUserAlreadyLogged(event) {
    event.preventDefault();
    fetch('auth/login', 'auth/signup', {
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

    fetch('auth/login', {
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


    fetch('auth/signup', {
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

//Handle Profile Menu


menu_item.forEach((item) => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobile_menu.classList.remove('active');
        
        mobile_menu.querySelectorAll('a').forEach(link => {
            link.style.color = '';
        });
    });
});
