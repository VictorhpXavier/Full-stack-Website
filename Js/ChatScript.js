document.addEventListener('DOMContentLoaded', function () {
    const mainHamburgerMenu = document.querySelector('#Hamburger-menu');
    const sideBar = document.querySelector('.sidebar');

    const chatWindow = document.querySelector('#chatWindow');

    if (mainHamburgerMenu) {
        mainHamburgerMenu.addEventListener('click', function () {
            var screenWidth = window.innerWidth;
            if (screenWidth <= 768) {
                if (
                    sideBar.style.display === 'none' ||
                    !sideBar.style.display
                ) {
                    sideBar.style.display = 'flex';
                } else {
                    sideBar.style.display = 'none';
                }
            } else if (
                (screenWidth > 768 && sideBar.style.display !== 'none') ||
                !sideBar.style.display
            ) {
                sideBar.style.display = 'none';
            } else {
                sideBar.style.display = 'flex';
            }
        });
    } else {
        console.error('Main hamburger menu not found');
    }

    //Handle profile menu
    const CircleButton = document.querySelector(
        '.nav-list  #CircleButton #Circle'
    );
    const DropDownMenu = document.querySelector('.nav-list .DropDownMenu');
    const SignOutButton = document.querySelector(
        '.nav-list .DropDownMenu .DropDownContent #SignOut'
    );

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
});

//Scroll to the last Message
document.getElementById('sendButton').addEventListener('click', () => {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
});

//Reload page if user change page size
window.addEventListener('resize', function () {
    'use strict';
    window.location.reload();
});

document.addEventListener('DOMContentLoaded', function () {
    const sendChat = document.querySelector('#sendButton');
    const chatInput = document.querySelector('#chatInput');
    sendChat.addEventListener('click', function () {
        const UserChat = document.querySelector('.ChatButton');
        const chatButton = document.getElementById('chatButton');
        const chat = chatInput.value.trim();
        const currentPath = window.location.pathname;

        if (chat.length >= 1) {
            chatInput.value = '';
            chatButton.textContent = 'This is a test';
            UserChat.style.display = 'flex';
            // Add User message
            addMessageToChat('user', chat);
            // Get Bot response
            setTimeout(() => {
                addMessageToChat('bot', getBotResponse(chat));
            }, 100);
        }

        const message = { message: chat };

        if (currentPath === '/workspace/chat') {
            fetch('/AddChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        const chatId = data.uuid; // Get the chat ID from response
                        const uuidLocation = `${window.location.origin}/workspace/chat/${chatId}`;
                        // Redirect to the new chat URL
                        window.location.href = uuidLocation;
                    } else {
                        console.error('Failed to add chat');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            const chatId = extractChatIdFromPath(currentPath); // Extract chat ID from the current path
            fetch('/AddMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: chat, chatId: chatId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.success) {
                        console.error('Failed to add message');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    });

    // Utility function to extract chat ID from URL path
    function extractChatIdFromPath(path) {
        const pathSegments = path.split('/');
        return pathSegments[pathSegments.length - 1]; // Assuming the chat ID is the last segment
    }

    
    //Show the input button if user didnt input anything button is blocked
    chatInput.addEventListener('input', function () {
        if (chatInput.value.length >= 1) {
            sendChat.style.opacity = '100%';
            sendChat.style.cursor = 'pointer';
        } else {
            sendChat.style.opacity = '35%';
            sendChat.style.cursor = 'not-allowed';
        }
    });

    //Put User message in the html structure
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.innerHTML = `<div class="message">${message}</div>`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    //Get Response from the bot
    function getBotResponse(userMessage) {
        const responses = {
            hello: 'Hi there!',
            hi: 'Hello!',
            how: 'I am just a bot, but I am here to help!',
            default: 'Sorry, I did not understand that.',
        };
        const responseKey = Object.keys(responses).find((key) =>
            userMessage.toLowerCase().includes(key)
        );
        return responses[responseKey] || responses.default;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // The user is on a chat page with a valid UUID

    if (
        /^\/workspace\/chat\/[0-9a-fA-F-]{36}$/.test(window.location.pathname)
    ) {
        console.log('User is on a chat page with a valid UUID');
        fetch('/GetUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {});
    }
    // The user is not on a chat page or the UUID is not valid
    else {
        console.log('User is not on a chat page with a valid UUID');
        fetch('/GetUserChatHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {});
    }
});
