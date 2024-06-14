document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.Recover-Button').addEventListener('click', RecoverPassword)
})
//Recover Password
function RecoverPassword(event) {
    event.preventDefault();
    const emailValue = document.querySelector('.Email').value.trim();
    const emailError = document.querySelector('.EmailError');
    const emailBox = document.querySelector('#inputBox .Email')
    emailError.style.display = 'none';
    emailError.innerHTML = '';
    document.querySelector('.Email').style.border = '';

    const data = { email: emailValue };

    fetch('auth/forgotpassword', {
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