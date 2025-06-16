
// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const chatbotIcon = document.getElementById('chatbotIcon');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatbotMessages');
const registrationForm = document.getElementById('registrationForm');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

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
let isWebhookConnected = false;
let webhookUrl = ''; // This will be set later when the webhook URL is provided

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
            // Send to webhook
            response = await sendToWebhook(message);
        } else {
            // Default responses when webhook is not connected
            response = getDefaultResponse(message);
        }

        // Remove typing indicator
        removeTypingIndicator(typingIndicator);

        // Add bot response
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Error sending message:', error);
        removeTypingIndicator(typingIndicator);
        addMessage('عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'bot');
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = text;
    messageDiv.appendChild(messageParagraph);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = '<p>جارٍ الكتابة...</p>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Remove typing indicator
function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}

// Send message to webhook
async function sendToWebhook(message) {
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            timestamp: new Date().toISOString(),
            source: 'qalam-schools-website'
        })
    });

    if (!response.ok) {
        throw new Error('Webhook request failed');
    }

    const data = await response.json();
    return data.reply || data.message || 'شكراً لرسالتك. سنتواصل معك قريباً.';
}

// Default responses when webhook is not connected
function getDefaultResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const responses = {
        'مرحبا': 'مرحباً بك في مدارس القلم! كيف يمكنني مساعدتك؟',
        'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته، أهلاً وسهلاً بك',
        'التسجيل': 'يمكنك التسجيل من خلال ملء النموذج في الأسفل أو الاتصال بنا على الرقم المذكور',
        'الرسوم': 'للاستفسار عن الرسوم الدراسية، يرجى الاتصال بنا على الرقم: +966 11 123 4567',
        'المناهج': 'نتبع المناهج السعودية المطورة مع إضافات تعليمية متميزة',
        'النقل': 'نوفر خدمة النقل المدرسي لجميع أحياء الرياض',
        'الأنشطة': 'لدينا أنشطة رياضية وثقافية وعلمية متنوعة للطلاب',
        'المعلمين': 'كادرنا التعليمي مؤهل وذو خبرة عالية في التعليم',
        'التواصل': 'يمكنك التواصل معنا عبر الهاتف أو البريد الإلكتروني أو زيارة المدرسة'
    };

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }

    // Default response
    return 'شكراً لتواصلك معنا. فريق خدمة العملاء سيرد عليك في أقرب وقت ممكن. للاستفسارات العاجلة يرجى الاتصال على: +966 11 123 4567';
}

// Function to connect webhook (will be called when webhook URL is provided)
function connectWebhook(url) {
    webhookUrl = url;
    isWebhookConnected = true;
    console.log('Webhook connected:', url);
    
    // Add a system message to indicate webhook is connected
    addMessage('تم تفعيل المساعد الذكي بنجاح! الآن يمكنني تقديم إجابات أكثر دقة.', 'bot');
}

// Event listeners for chat
sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Registration form handling
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        studentName: document.getElementById('studentName').value,
        parentName: document.getElementById('parentName').value,
        phone: document.getElementById('phone').value,
        grade: document.getElementById('grade').value
    };
    
    // Here you would typically send the data to your server
    console.log('Registration data:', formData);
    
    // Show success message
    alert('تم إرسال طلب التسجيل بنجاح! سنتواصل معكم في أقرب وقت ممكن.');
    
    // Reset form
    registrationForm.reset();
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .program-card, .facility-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as Saudi phone number
    if (cleaned.length === 10 && cleaned.startsWith('5')) {
        return `+966 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
    } else if (cleaned.length === 9 && cleaned.startsWith('5')) {
        return `+966 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
    }
    
    return phone; // Return original if format doesn't match
}

// Phone number formatting on input
document.getElementById('phone').addEventListener('input', (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted !== e.target.value) {
        e.target.value = formatted;
    }
});

// Expose functions for external use (webhook integration)
window.QalamChat = {
    connectWebhook: connectWebhook,
    addMessage: addMessage,
    isConnected: () => isWebhookConnected
};

// Console log for developers
console.log('مدارس القلم - Al Qalam Schools');
console.log('Website loaded successfully!');
console.log('To connect chatbot webhook, use: window.QalamChat.connectWebhook("your-webhook-url")');
