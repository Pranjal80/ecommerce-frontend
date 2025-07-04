import {
    auth,
    onAuthStateChanged,
    signOut
} from './firebase.js';

import { auth, signOut } from './firebase.js';

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shopswift_cart')) || { count: 0 };
    document.querySelector('.cart-count').textContent = cart.count;
}

function initializeLogout() {
    const logoutBtn = document.getElementById('logout-button');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async () => {
        await signOut(auth);
        alert('You have been logged out.');
        window.location.href = 'login.html';
    });
}

function showAuthUI() {
    const loginBtn = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-button');

    onAuthStateChanged(auth, user => {
        if (user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    showAuthUI();
    initializeLogout();
});

document.addEventListener('click', e => {
    if (e.target.id === 'logout') {
        signOut(auth)
            .then(() => {
                alert('Logged out successfully!');
                window.location.href = 'login.html';
            })
            .catch(err => alert(err.message));
    }
});