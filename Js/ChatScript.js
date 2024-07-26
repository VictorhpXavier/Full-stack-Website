document.addEventListener('DOMContentLoaded', function () {
    const mainHamburgerMenu = document.querySelector('#Hamburger-menu');
    const sideBar = document.querySelector('.sidebar');
    const newChatButton = document.getElementById('NewChat');
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

    newChatButton.addEventListener('click', function () {
        window.location.pathname = '/workspace/chat';
    });
});

//Scroll to the last Message
document.getElementById('sendButton').addEventListener('click', () => {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
});



document.addEventListener('DOMContentLoaded', function () {
    updateUserPhotoLink()

    const sendChat = document.querySelector('#sendButton');
    const chatInput = document.querySelector('#chatInput');
    const chatWindow = document.querySelector('#chatWindow');

    sendChat.addEventListener('click', async function () {
        const chat = chatInput.value.trim();
        const currentPath = window.location.pathname;

        if (chat.length >= 1) {
            chatInput.value = '';
            addMessageToChat('user', chat);

            // Fetch the bot response
            const botMessage = await getBotResponseFromServer(chat);

            addMessageToChat('bot', botMessage);
            console.log(botMessage);

            const message = { message: chat, botMessage: botMessage };

            if (
                currentPath === '/workspace/chat' ||
                currentPath === '/workspace/chat/'
            ) {
                fetch('/AddChat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const chatId = data.uuid; // Get the chat ID from response
                        const uuidLocation = `${window.location.origin}/workspace/chat/${chatId}`;
                        // Redirect to the new chat URL
                        window.location.href = uuidLocation;
                    } else {
                        console.error('Failed to add chat');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                const chatId = extractChatIdFromPath(currentPath); // Extract chat ID from the current path
                fetch('/AddMessages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: chat,
                        chatId: chatId,
                        botMessage: botMessage,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        console.error('Failed to add message');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    });

    // Utility function to extract chat ID from URL path
    function extractChatIdFromPath(path) {
        const pathSegments = path.split('/');
        return pathSegments[pathSegments.length - 1]; // Assuming the chat ID is the last segment
    }

    // Show the input button if user didn't input anything; button is blocked
    chatInput.addEventListener('input', function () {
        if (chatInput.value.length >= 1) {
            sendChat.style.opacity = '100%';
            sendChat.style.cursor = 'pointer';
        } else {
            sendChat.style.opacity = '35%';
            sendChat.style.cursor = 'not-allowed';
        }
    });

    // Put User message in the html structure
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.innerHTML = `<div class="message">${message}</div>`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function getBotResponseFromServer(userMessage) {
        try {
            // Fetch bot response from server
            const response = await fetch('/getBotResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chat: userMessage }),
            });
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, something went wrong.';
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const chatsLinks = document.getElementById('chatButton');
    const UserChat = document.querySelector('.ChatButton');
    const buttonContainer = document.getElementById('chatButtonContainer');
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const uuid = parts[parts.length - 1];
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
            .then((data) => {
                if (data.success) {
                    const chats = data.chatHistory;
                    if (chats.length > 0) {
                        UserChat.style.display = 'flex';
                        for (let i = 0; i < chats.length; i++) {
                            const chat = chats[i];
                            const newButton = document.createElement('a');
                            newButton.textContent = chat.chat_name;
                            newButton.href = `/workspace/chat/${chat.chat_id}`;
                            buttonContainer.appendChild(newButton);
                        }
                    }
                } else {
                    console.error('Failed to retrieve chat history');
                }
            })
            .catch((error) => {
                console.error('Error fetching chat history:', error);
            });
        fetch('/GetUserMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatId: uuid }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const userMessages = data.userMessages;
                    const botMessages = data.botMessages;

                    // Function to add a message to the chat window
                    function addMessageToChat(sender, message) {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('chat-message', sender);
                        messageElement.innerHTML = `<div class="message">${message}</div>`;
                        chatWindow.appendChild(messageElement);
                        chatWindow.scrollTop = chatWindow.scrollHeight;
                    }

                    // Loop through user messages and add them to the chat window
                    userMessages.forEach((message) => {
                        addMessageToChat('user', message);
                    });

                    // Loop through bot messages and add them to the chat window
                    botMessages.forEach((message) => {
                        addMessageToChat('bot', message);
                    });
                } else {
                    console.error('Failed to retrieve messages');
                }
            });
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
            .then((data) => {
                if (data.success) {
                    const chats = data.chatHistory;
                    if (chats.length > 0) {
                        UserChat.style.display = 'flex';
                        for (let i = 0; i < chats.length; i++) {
                            const chat = chats[i];
                            const newButton = document.createElement('a');
                            newButton.textContent = chat.chat_name;
                            newButton.href = `/workspace/chat/${chat.chat_id}`;
                            buttonContainer.appendChild(newButton);
                        }
                    }
                } else {
                    console.error('Failed to retrieve chat history');
                }
            })
            .catch((error) => {
                console.error('Error fetching chat history:', error);
            });
    }
});

window.addEventListener('resize', adjustChatButtonHeight);
window.addEventListener('load', adjustChatButtonHeight);

function adjustChatButtonHeight() {
    const chatButton = document.getElementById('chatButtonContainer');
    const sidebarItem = chatButton.closest('.sidebar-item2');

    // Calculate the space available
    const viewportHeight = window.innerHeight;
    const sidebarItemTop = sidebarItem.getBoundingClientRect().top;
    const availableHeight = viewportHeight - sidebarItemTop - 60; // 20px from bottom

    chatButton.style.maxHeight = `${availableHeight}px`;
}

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
        alert('Failed to update photo link');
    });
}
