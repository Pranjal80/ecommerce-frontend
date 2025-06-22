function loadCart() {
    const cart = localStorage.getItem('shopswift_cart');
    return cart ? JSON.parse(cart) : { count: 0, items: [] };
}

function updateCartCount() {
    const cart = loadCart();
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.count;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

function initializeLoginForm() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginButton = document.getElementById('login-button');
    const togglePassword = document.querySelector('.toggle-password');

    function validateForm() {
        const isEmailValid = validateEmail(emailInput.value);
        const isPasswordValid = validatePassword(passwordInput.value);

        emailError.textContent = isEmailValid ? '' : 'Please enter a valid email';
        passwordError.textContent = isPasswordValid ? '' : 'Password must be at least 8 characters with uppercase, lowercase, and a number';

        loginButton.disabled = !(isEmailValid && isPasswordValid);
    }

    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    loginButton.addEventListener('click', () => {
        if (!loginButton.disabled) {
            alert('Login successful! (Mock action)');
            window.location.href = 'index.html';
        }
    });
}

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initializeMobileMenu();
    initializeLoginForm();
});