import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "./firebase.js";

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("shopswift_cart")) || { count: 0 };
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cart.count;
  }
}

function initializeLoginForm() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login-button");
  const errorMessage = document.getElementById("login-error");

  if (!loginButton) return;

  loginButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      errorMessage.textContent = "Please enter email and password";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "index.html";
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initializeLoginForm();
});
