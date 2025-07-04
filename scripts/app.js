import {
    auth,
    onAuthStateChanged,
    signOut
} from "./firebase.js";

function updateCartCount() {
    const t = JSON.parse(localStorage.getItem("shopswift_cart")) || {
        count: 0
    };
    document.querySelector(".cart-count").textContent = t.count
}

function initializeLogout() {
    const t = document.getElementById("logout-button");
    t && t.addEventListener("click", async () => {
        await signOut(auth), alert("You have been logged out."), window.location.href = "login.html"
    })
}

function showAuthUI() {
    const t = document.getElementById("login-link"),
        n = document.getElementById("logout-button");
    onAuthStateChanged(auth, e => {
        e ? (t && (t.style.display = "none"), n && (n.style.display = "inline-block")) : (t && (t.style.display = "inline-block"), n && (n.style.display = "none"))
    })
}
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount(), showAuthUI(), initializeLogout()
}), document.addEventListener("click", t => {
    "logout" === t.target.id && signOut(auth).then(() => {
        alert("Logged out successfully!"), window.location.href = "login.html"
    }).catch(t => alert(t.message))
});