// js/auth.js
const API_URL = "http://localhost:5000/api/auth"; // backend base URL

// Signup
const signupBtn = document.getElementById("doSignup");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("su_email").value.trim();
    const password = document.getElementById("su_password").value;
    const msg = document.getElementById("signupMsg");

    if (!name || !email || !password) {
      msg.textContent = "Please fill all fields";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        msg.style.color = "green";
        msg.textContent = "Signup successful! Redirecting...";
        setTimeout(() => (window.location.href = "customer-dashboard.html"), 1500);
      } else {
        msg.style.color = "red";
        msg.textContent = data.message || "Signup failed!";
      }
    } catch (err) {
      msg.textContent = "Error connecting to server.";
    }
  });
}

// Login
const loginBtn = document.getElementById("doLogin");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMsg");

    if (!email || !password) {
      msg.textContent = "Please enter email and password";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        msg.style.color = "green";
        msg.textContent = "Login successful! Redirecting...";
        localStorage.setItem("token", data.token); // save token for later use
        setTimeout(() => (window.location.href = "customer-dashboard.html"), 1500);
      } else {
        msg.style.color = "red";
        msg.textContent = data.message || "Invalid credentials!";
      }
    } catch (err) {
      msg.textContent = "Error connecting to server.";
    }
  });
}

