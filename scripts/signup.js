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

function getPasswordStrength(password) {
    if (password.length < 8) return 'weak';
    if (validatePassword(password)) return 'strong';
    return 'medium';
}

function initializeSignupForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const passwordStrength = document.getElementById('password-strength');
    const signupButton = document.getElementById('signup-button');
    const togglePassword = document.querySelector('.toggle-password');

    function validateForm() {
        const isNameValid = nameInput.value.trim().length > 0;
        const isEmailValid = validateEmail(emailInput.value);
        const isPasswordValid = validatePassword(passwordInput.value);
        const isConfirmPasswordValid = passwordInput.value === confirmPasswordInput.value && isPasswordValid;

        nameError.textContent = isNameValid ? '' : 'Please enter your full name';
        emailError.textContent = isEmailValid ? '' : 'Please enter a valid email';
        passwordError.textContent = isPasswordValid ? '' : 'Password must be at least 8 characters with uppercase, lowercase, and a number';
        confirmPasswordError.textContent = isConfirmPasswordValid ? '' : 'Passwords do not match';

        const strength = getPasswordStrength(passwordInput.value);
        passwordStrength.textContent = strength === 'weak' ? 'Weak' : strength === 'medium' ? 'Medium' : 'Strong';
        passwordStrength.className = `password-strength ${strength}`;

        signupButton.disabled = !(isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid);
    }

    nameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);
    confirmPasswordInput.addEventListener('input', validateForm);

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    signupButton.addEventListener('click', () => {
        if (!signupButton.disabled) {
            alert('Signup successful! (Mock action)');
            window.location.href = 'login.html';
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
    initializeSignupForm();
});