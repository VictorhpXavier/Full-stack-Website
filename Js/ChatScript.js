document.addEventListener('DOMContentLoaded', function () {
    const mainHamburgerMenu = document.querySelector('#Hamburger-menu');
    const sideBar = document.querySelector('.sidebar');
    const sendChat = document.querySelector('#sendButton');
    const chatInput = document.querySelector('#chatInput');
    const chatWindow = document.querySelector('#chatWindow');
    const UserChat = document.querySelector('.ChatButton');
    const chatButton = document.getElementById('chatButton'); 

    if (mainHamburgerMenu) {
        mainHamburgerMenu.addEventListener('click', function() {
            var screenWidth = window.innerWidth;
            if (screenWidth <= 768) {
                if (sideBar.style.display === 'none' || !sideBar.style.display) {
                    sideBar.style.display = 'flex';
                } else {
                    sideBar.style.display = 'none';
                }
            } else if (screenWidth > 768 && sideBar.style.display !== 'none' || !sideBar.style.display) {
                sideBar.style.display = 'none';
            } else {
                sideBar.style.display = 'flex';
            }
        });
    } else {
        console.error('Main hamburger menu not found');
    }

    if (sendChat) {
        sendChat.addEventListener('click', function () {
            const chatMessage = chatInput.value.trim();
            if (chatMessage.length >= 1) {
                addMessageToChat('user', chatMessage);
                chatInput.value = '';
                chatButton.textContent = 'This is a test';
                UserChat.style.display = 'flex';

                setTimeout(() => {
                    addMessageToChat('bot', getBotResponse(chatMessage));
                }, 100);
            }
        });
    }

    chatInput.addEventListener('input', function() {
        if (chatInput.value.length >= 1) {
            sendChat.style.opacity = '100%';
            sendChat.style.cursor = 'pointer';
        } else {
            sendChat.style.opacity = '35%';
            sendChat.style.cursor = 'not-allowed';
        }
    });

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.innerHTML = `<div class="message">${message}</div>`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function getBotResponse(userMessage) {
        const responses = {
            hello: 'Hi there!',
            hi: 'Hello!',
            how: 'I am just a bot, but I am here to help!',
            default: 'Sorry, I did not understand that.'
        };
        const responseKey = Object.keys(responses).find(key => userMessage.toLowerCase().includes(key));
        return responses[responseKey] || responses.default;
    }
    
    //Handle profile menu
    const CircleButton = document.querySelector('.nav-list  #CircleButton #Circle'); 
    const DropDownMenu = document.querySelector('.nav-list .DropDownMenu');
    const SignOutButton = document.querySelector('.nav-list .DropDownMenu .DropDownContent #SignOut');

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
});

document.getElementById('sendButton').addEventListener('click', () => {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
});


window.addEventListener('resize', function () { 
    "use strict";
    window.location.reload(); 
});


