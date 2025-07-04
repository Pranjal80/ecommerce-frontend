import {
    auth,
    createUserWithEmailAndPassword
} from "./firebase.js";

function updateCartCount() {
    const t = JSON.parse(localStorage.getItem("shopswift_cart")) || {
        count: 0
    };
    document.querySelector(".cart-count").textContent = t.count
}

function validateEmail(t) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

function validatePassword(t) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(t)
}

function initializeSignupForm() {
    const t = document.getElementById("email"),
        e = document.getElementById("password"),
        n = document.getElementById("name"),
        o = document.getElementById("confirm-password"),
        r = document.getElementById("signup-button"),
        c = document.getElementById("signup-error");
    r.addEventListener("click", async () => {
        const r = t.value.trim(),
            i = e.value.trim(),
            a = o.value.trim();
        if (!validateEmail(r) || !validatePassword(i)) return void(c.textContent = "Invalid email or weak password");
        if (i !== a) return void(c.textContent = "Passwords do not match");
        try {
            await createUserWithEmailAndPassword(auth, r, i), alert("Signup successful!"), window.location.href = "index.html"
        } catch (t) {
            c.textContent = t.message
        }
    })
}
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount(), initializeSignupForm()
});