import {
    auth,
    createUserWithEmailAndPassword
} from './firebase.js';

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shopswift_cart')) || { count: 0 };
    document.querySelector('.cart-count').textContent = cart.count;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function initializeSignupForm() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('name');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const signupButton = document.getElementById('signup-button');
    const errorMessage = document.getElementById('signup-error');

    signupButton.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!validateEmail(email) || !validatePassword(password)) {
            errorMessage.textContent = 'Invalid email or weak password';
            return;
        }
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Signup successful!');
            window.location.href = 'index.html';
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initializeSignupForm();
});
