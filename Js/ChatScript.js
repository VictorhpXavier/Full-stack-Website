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
                    
                    // Filter out chats that are not visible to the user
                    const visibleChats = chats.filter(chat => chat.visibleToUser === 1);
                    
                    if (visibleChats.length > 0) {
                        // Sort the visible chats by updated_at date in descending order
                        visibleChats.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                
                        UserChat.style.display = 'flex';
                        for (let i = 0; i < visibleChats.length; i++) {
                            const chat = visibleChats[i];
                            const newButton = document.createElement('a');
                            newButton.href = `/workspace/chat/${chat.chat_id}`;
                            newButton.classList.add('chat-button');

                            // Create a container for the chat name
                            const chatNameContainer = document.createElement('span');
                            chatNameContainer.textContent = chat.chat_name;

                            // Append the chat name container to the new button
                            newButton.appendChild(chatNameContainer);

                            const span = document.createElement('span');
                            const settings = document.createElement('span');

                            settings.textContent = 'settings';
                            settings.classList.add('settings');
                            span.textContent = '...';
                            span.classList.add('dots');

                            span.appendChild(settings);
                            newButton.appendChild(span);

                            const buttonContainer = document.getElementById('chatButtonContainer');
                            buttonContainer.appendChild(newButton);

                            // Create menu for Delete and Rename
                            const menu = document.createElement('div');
                            menu.classList.add('menu');
                            menu.innerHTML = `
                                <div class="menu-item rename">Rename</div>
                                <div class="menu-item delete">Delete</div>
                            `;
                            document.body.appendChild(menu);

                            newButton.addEventListener('mouseenter', function() {
                                span.style.display = 'flex';
                            });

                            newButton.addEventListener('mouseleave', function() {
                                span.style.display = 'none';
                                
                            });

                            span.addEventListener('mouseenter', function() {
                                newButton.style.backgroundColor = '#424242';
                                settings.style.display = 'block';
                            });
                            span.addEventListener('click', function(event) {
                                event.preventDefault();
                                // Show menu at the position of the span
                                const rect = span.getBoundingClientRect();
                                menu.style.top = `${rect.bottom}px`;
                                menu.style.left = `${rect.left}px`;
                                menu.style.display = 'block';
                            });
                            
                            span.addEventListener('mouseleave', function() {
                                newButton.style.backgroundColor = '';
                                settings.style.display = 'none';
                            });
                           
                           
                            // Hide menu when clicking outside
                            document.addEventListener('click', function(event) {
                                if (!span.contains(event.target) && !menu.contains(event.target)) {
                                    menu.style.display = 'none';
                                }
                            });

                            // Menu item event listeners

                            menu.querySelector('.rename').addEventListener('click', function() {
                                menu.style.display = 'none';
                            
                                // Create an input field for renaming
                                const input = document.createElement('input');
                                input.type = 'text';
                                input.value = chat.chat_name;
                                input.classList.add('rename-input');
                            
                                // Replace the chat name container with the input field
                                newButton.replaceChild(input, chatNameContainer);
                            
                                // Focus on the input field and select the text
                                input.focus();
                                input.select();
                            
                                // Handle input field events
                                input.addEventListener('blur', function() {
                                    newButton.replaceChild(chatNameContainer, input);
                                });
                            
                                input.addEventListener('keydown', function(event) {
                                    if (event.key === 'Enter') {
                                        const newName = input.value;
                                        const chatlink = newButton.href; 
                                        
                                        
                                        fetch('/RenameChat', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ chatlink: chatlink, newName: newName }),
                                        })
                                        .then((response) => response.json())
                                        .then((data) => {
                                            if (data.success) {
                                                chatNameContainer.textContent = newName;
                                                newButton.replaceChild(chatNameContainer, input);
                                            } else {
                                            }
                                        });
                                    } else if (event.key === 'Escape') {
                                        // Restore the original chat name container if input loses focus
                                        newButton.replaceChild(chatNameContainer, input);
                                    }
                                });
                            });
                            menu.querySelector('.delete').addEventListener('click', function() {
                                const deleteChatMenu = document.querySelector('.Delete-Chat');
                                const overlayEffect = document.querySelector('#overlay');
                                const confirmationInput = document.querySelector('.Delete-Chat input');
                                const chatlink = newButton.href;
                                menu.style.display = 'none'
                                deleteChatMenu.style.display = 'block';
                                overlayEffect.style.display = 'block';
                                
                                fetch('/RequestChatName', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ chatlink: chatlink }),
                                })
                                .then((response) => response.json())
                                .then((data) => { 
                                    const chatName = data.chatName;
                                    const deleteChatHeading = document.querySelector('#deleteChatHeading');
                                    deleteChatHeading.textContent = `Delete chat "${chatName}"`;
                                    const chatP = document.querySelector('#deleteChatP')
                                    chatP.textContent = `Please write, to confirm "Delete chat ${chatName}"`;
                                    const inputDelete = document.querySelector('#DeleteChat')
                                    inputDelete.placeholder = `Delete chat ${chatName}`
                                    const deleteButton = document.querySelector('.Delete-Chat button');
                                    document.querySelector('.Delete-Chat .close-btn').addEventListener('click', function() {
                                        const deleteChatMenu = document.querySelector('.Delete-Chat');
                                        const overlayEffect = document.querySelector('#overlay');
                                        
                                        deleteChatMenu.style.display = 'none';
                                        overlayEffect.style.display = 'none';
                                    });
                                    function updateDeleteButton() {
                                        if (confirmationInput.value === `Delete chat ${chatName}`) {
                                            deleteButton.style.opacity = '100%';
                                            deleteButton.style.cursor = 'pointer';
                                            deleteButton.addEventListener('click', deleteChat); // Add event listener to allow action
                                        } else {
                                            deleteButton.style.opacity = '35%';
                                            deleteButton.style.cursor = 'not-allowed';
                                            deleteButton.removeEventListener('click', deleteChat); // Remove event listener to prevent action
                                        }
                                    }
                                
                                    function deleteChat() {
                                        fetch('/DeleteChat', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ chatlink: chatlink }),
                                        })
                                        .then((response) => response.json())
                                        .then((data) => { 
                                            if(data.success) {
                                                window.location.href = '/workspace/chat'
                                              }
                                        });
                                    }
                                
                                    confirmationInput.addEventListener('input', (event) => {
                                        updateDeleteButton();
                                    });
                                
                                    updateDeleteButton();
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });
                               
                            });    
                        }
                    }
                }
                else {
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
                
                    const combinedMessages = [];
                
                    userMessages.forEach((message, index) => {
                        combinedMessages.push({ sender: 'user', message: message, index: index });
                    });
                
                    botMessages.forEach((message, index) => {
                        combinedMessages.push({ sender: 'bot', message: message, index: index });
                    });
                
                    combinedMessages.sort((a, b) => a.index - b.index);
                
                    // Function to add a message to the chat window
                    function addMessageToChat(sender, message) {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('chat-message', sender);
                        messageElement.innerHTML = `<div class="message">${message}</div>`;
                        chatWindow.appendChild(messageElement);
                        chatWindow.scrollTop = chatWindow.scrollHeight;
                    }
                
                    combinedMessages.forEach((msg) => {
                        addMessageToChat(msg.sender, msg.message);
                    });
                } else {
                    console.error('Failed to retrieve messages');
                }
            });
    }
    // The user is not on a chat page or the UUID is not valid
    else {

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
                    
                    // Filter out chats that are not visible to the user
                    const visibleChats = chats.filter(chat => chat.visibleToUser === 1);
                    
                    if (visibleChats.length > 0) {
                        // Sort the visible chats by updated_at date in descending order
                        visibleChats.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                
                        UserChat.style.display = 'flex';
                        for (let i = 0; i < visibleChats.length; i++) {

                            const chat = visibleChats[i];
                            const newButton = document.createElement('a');
                            newButton.href = `/workspace/chat/${chat.chat_id}`;
                            newButton.classList.add('chat-button');

                            // Create a container for the chat name
                            const chatNameContainer = document.createElement('span');
                            chatNameContainer.textContent = chat.chat_name;

                            // Append the chat name container to the new button
                            newButton.appendChild(chatNameContainer);

                            const span = document.createElement('span');
                            const settings = document.createElement('span');

                            settings.textContent = 'settings';
                            settings.classList.add('settings');
                            span.textContent = '...';
                            span.classList.add('dots');

                            span.appendChild(settings);
                            newButton.appendChild(span);

                            const buttonContainer = document.getElementById('chatButtonContainer');
                            buttonContainer.appendChild(newButton);

                            // Create menu for Delete and Rename
                            const menu = document.createElement('div');
                            menu.classList.add('menu');
                            menu.innerHTML = `
                                <div class="menu-item rename">Rename</div>
                                <div class="menu-item delete">Delete</div>
                            `;
                            document.body.appendChild(menu);

                            newButton.addEventListener('mouseenter', function() {
                                span.style.display = 'flex';
                            });

                            newButton.addEventListener('mouseleave', function() {
                                span.style.display = 'none';
                                
                            });

                            span.addEventListener('mouseenter', function() {
                                newButton.style.backgroundColor = '#424242';
                                settings.style.display = 'block';
                            });
                            span.addEventListener('click', function(event) {

                                event.preventDefault();
                                // Show menu at the position of the span
                                const rect = span.getBoundingClientRect();
                                menu.style.top = `${rect.bottom}px`;
                                menu.style.left = `${rect.left}px`;
                                menu.style.display = 'block';
                            });
                            
                            span.addEventListener('mouseleave', function() {
                                newButton.style.backgroundColor = '';
                                settings.style.display = 'none';
                            });
                           
                           
                            // Hide menu when clicking outside
                            

                            // Menu item event listeners

                            menu.querySelector('.rename').addEventListener('click', function() {
                                menu.style.display = 'none';
                                // Create an input field for renaming
                                const input = document.createElement('input');
                                input.type = 'text';
                                input.value = chat.chat_name;
                                input.classList.add('rename-input');
                            
                                // Replace the chat name container with the input field
                                newButton.replaceChild(input, chatNameContainer);
                            
                                // Focus on the input field and select the text
                                input.focus();
                                input.select();
                            
                                // Handle input field events
                                input.addEventListener('blur', function() {
                                    newButton.replaceChild(chatNameContainer, input);
                                });
                            
                                input.addEventListener('keydown', function(event) {
                                    if (event.key === 'Enter') {
                                        const newName = input.value;
                                        const chatlink = newButton.href; 
                                        
                                        
                                        fetch('/RenameChat', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ chatlink: chatlink, newName: newName }),
                                        })
                                        .then((response) => response.json())
                                        .then((data) => {
                                            if (data.success) {
                                                chatNameContainer.textContent = newName;
                                                newButton.replaceChild(chatNameContainer, input);
                                            } else {
                                            }
                                        });
                                    } else if (event.key === 'Escape') {
                                        // Restore the original chat name container if input loses focus
                                        newButton.replaceChild(chatNameContainer, input);
                                    }
                                });
                            });

                            menu.querySelector('.delete').addEventListener('click', function() {
                                const deleteChatMenu = document.querySelector('.Delete-Chat');
                                const overlayEffect = document.querySelector('#overlay');
                                const confirmationInput = document.querySelector('.Delete-Chat input');
                                const chatlink = newButton.href;
                                menu.style.display = 'none'
                                deleteChatMenu.style.display = 'block';
                                overlayEffect.style.display = 'block';
                                
                                fetch('/RequestChatName', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ chatlink: chatlink }),
                                })
                                .then((response) => response.json())
                                .then((data) => { 
                                    const chatName = data.chatName;
                                    const deleteChatHeading = document.querySelector('#deleteChatHeading');
                                    deleteChatHeading.textContent = `Delete chat "${chatName}"`;
                                    const chatP = document.querySelector('#deleteChatP')
                                    chatP.textContent = `Please write, to confirm "Delete chat ${chatName}"`;
                                    const inputDelete = document.querySelector('#DeleteChat')
                                    inputDelete.placeholder = `Delete chat ${chatName}`
                                    const deleteButton = document.querySelector('.Delete-Chat button');
                                    document.querySelector('.Delete-Chat .close-btn').addEventListener('click', function() {
                                        const deleteChatMenu = document.querySelector('.Delete-Chat');
                                        const overlayEffect = document.querySelector('#overlay');
                                        deleteChatMenu.style.display = 'none';
                                        overlayEffect.style.display = 'none';
                                    });
                                    function updateDeleteButton() {
                                        if (confirmationInput.value === `Delete chat ${chatName}`) {
                                            deleteButton.style.opacity = '100%';
                                            deleteButton.style.cursor = 'pointer';
                                            deleteButton.addEventListener('click', deleteChat); // Add event listener to allow action
                                        } else {
                                            deleteButton.style.opacity = '35%';
                                            deleteButton.style.cursor = 'not-allowed';
                                            deleteButton.removeEventListener('click', deleteChat); // Remove event listener to prevent action
                                        }
                                    }
                                
                                    function deleteChat() {
                                        fetch('/DeleteChat', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ chatlink: chatlink }),
                                        })
                                        .then((response) => response.json())
                                        .then((data) => { 
                                          if(data.success) {
                                            window.location.href = '/workspace/chat'
                                          }
                                        });
                                    }
                                
                                    confirmationInput.addEventListener('input', (event) => {
                                        updateDeleteButton();
                                    });
                                
                                    updateDeleteButton();
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });
                               
                            });    
                        }
                    }
                }
                else {
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
        const circleElement = document.querySelector('.nav-list  #CircleButton #Circle');
        if (data.success) {
            if (data.photoLink) {
                const photoUrl = `/uploads/${data.photoLink}`;
                circleElement.style.backgroundImage = `url(${photoUrl})`;
            } 
        } 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
