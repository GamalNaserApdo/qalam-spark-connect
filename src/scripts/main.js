// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    const animateElements = document.querySelectorAll('.feature-card, .program-card, .facility-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
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
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        if (formatted !== e.target.value) {
            e.target.value = formatted;
        }
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Console log for developers
console.log('مدارس القلم - Al Qalam Schools');
console.log('Website loaded successfully!');
console.log('n8n Chatbot integrated and ready!');
