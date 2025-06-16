
// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Registration form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const studentName = document.getElementById('studentName').value;
            const parentName = document.getElementById('parentName').value;
            const phone = document.getElementById('phone').value;
            const grade = document.getElementById('grade').value;
            
            // Simple validation
            if (!studentName || !parentName || !phone || !grade) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            alert('تم إرسال طلب التسجيل بنجاح! سنتواصل معكم قريباً.');
            registrationForm.reset();
        });
    }

    // Initialize chatbot
    initializeChatbot();
});

// Chatbot functionality
let isWebhookConnected = true;
let webhookUrl = 'https://sidrah.app.n8n.cloud/webhook-test/95e9288e-942a-41ce-a0aa-5ab24f7986de';

function initializeChatbot() {
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const sendButton = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatbotMessages');

    console.log('Initializing chatbot...');
    console.log('Chatbot elements found:', {
        icon: !!chatbotIcon,
        window: !!chatbotWindow,
        close: !!chatbotClose,
        send: !!sendButton,
        input: !!chatInput,
        messages: !!messagesContainer
    });

    if (!chatbotIcon || !chatbotWindow) {
        console.error('Chatbot elements not found!');
        return;
    }

    // Toggle chatbot window
    chatbotIcon.addEventListener('click', function() {
        console.log('Chatbot icon clicked');
        const isActive = chatbotWindow.classList.contains('active');
        
        if (isActive) {
            chatbotWindow.classList.remove('active');
            console.log('Chatbot window closed');
        } else {
            chatbotWindow.classList.add('active');
            console.log('Chatbot window opened');
            if (chatInput) {
                chatInput.focus();
            }
        }
    });

    // Close chatbot window
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            console.log('Chatbot close button clicked');
            chatbotWindow.classList.remove('active');
        });
    }

    // Send message functionality
    function sendMessage() {
        if (!chatInput || !messagesContainer) return;
        
        const message = chatInput.value.trim();
        if (!message) return;

        console.log('Sending message:', message);

        // Add user message to chat
        addMessageToChat(message, 'user');
        chatInput.value = '';

        // Send to webhook if connected
        if (isWebhookConnected && webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    timestamp: new Date().toISOString()
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Webhook response:', data);
                // Add bot response to chat
                if (data.response) {
                    addMessageToChat(data.response, 'bot');
                } else {
                    addMessageToChat('شكراً لك على رسالتك. سنقوم بالرد عليك قريباً.', 'bot');
                }
            })
            .catch(error => {
                console.error('Error sending to webhook:', error);
                addMessageToChat('شكراً لك على رسالتك. سنقوم بالرد عليك قريباً.', 'bot');
            });
        } else {
            // Default response if no webhook
            setTimeout(() => {
                addMessageToChat('شكراً لك على رسالتك. سنقوم بالرد عليك قريباً.', 'bot');
            }, 1000);
        }
    }

    // Send button event
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Enter key to send message
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Add message to chat function
    function addMessageToChat(message, type) {
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(type === 'user' ? 'user-message' : 'bot-message');
        
        const messageP = document.createElement('p');
        messageP.textContent = message;
        messageDiv.appendChild(messageP);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}
