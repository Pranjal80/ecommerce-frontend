const firebaseConfig = {
  apiKey: "AIzaSyD_sX2uMdhkllXN2LGv0ad65QR8ZivX4mI",
  authDomain: "shopswift-a940e.firebaseapp.com",
  projectId: "shopswift-a940e",
  storageBucket: "shopswift-a940e.appspot.com",
  messagingSenderId: "913216550088",
  appId: "1:913216550088:web:bf1652055334a62e8ae1fd",
  measurementId: "G-BZ8EMSYKNL"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const errorDiv = document.getElementById("signup-error");

    errorDiv.classList.add("hidden");

    if (password !== confirm) {
      errorDiv.textContent = "Passwords do not match.";
      errorDiv.classList.remove("hidden");
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then(cred => cred.user.updateProfile({ displayName: name }))
      .then(() => {
        window.location.href = "index.html";
      })
      .catch(err => {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove("hidden");
      });
  });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");

    errorDiv.classList.add("hidden");

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch(err => {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove("hidden");
      });
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Logged in as:", user.email);
  }
});

function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
