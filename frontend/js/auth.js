(async () => {
  const BASE_URL = "http://localhost:5000/api/user"; // Match backend route

  function showMessage(el, msg, color = "red") {
    if (!el) return;
    el.style.color = color;
    el.textContent = msg;
  }

  // ===== CUSTOMER LOGIN =====
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        showMessage(loginMsg, "Enter email and password");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          showMessage(loginMsg, "Login successful! Redirecting...", "green");
          localStorage.setItem("es_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          setTimeout(() => window.location.href = "customer-dashboard.html", 1000);
        } else {
          showMessage(loginMsg, data.message || "Invalid credentials");
        }
      } catch (err) {
        console.error(err);
        showMessage(loginMsg, "Server error");
      }
    });
  }

  // ===== CUSTOMER SIGNUP =====
  const doSignupBtn = document.getElementById("doSignup");
  if (doSignupBtn) {
    doSignupBtn.addEventListener("click", async () => {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("su_email").value.trim();
      const password = document.getElementById("su_password").value.trim();
      const msg = document.getElementById("signupMsg");

      if (!name || !email || !password) {
        showMessage(msg, "Please fill all fields");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          showMessage(msg, "Account created! Redirecting...", "#7c5cff");
          localStorage.setItem("es_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => window.location.href = "customer-dashboard.html", 1000);
        } else {
          showMessage(msg, data.message || "Signup failed");
        }
      } catch (err) {
        console.error(err);
        showMessage(msg, "Server error, try later");
      }
    });
  }

  // ===== ADMIN LOGIN =====
  const doAdminLoginBtn = document.getElementById("doAdminLogin");
  if (doAdminLoginBtn) {
    doAdminLoginBtn.addEventListener("click", async () => {
      const email = document.getElementById("adminEmail").value.trim();
      const password = document.getElementById("adminPassword").value.trim();
      const msg = document.getElementById("adminLoginMsg");

      if (!email || !password) {
        showMessage(msg, "Enter email and password");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.user.role === "admin") {
          showMessage(msg, "Admin login successful! Redirecting...", "green");
          localStorage.setItem("es_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => window.location.href = "admin-dashboard.html", 1000);
        } else {
          showMessage(msg, data.message || "Invalid admin credentials");
        }
      } catch (err) {
        console.error(err);
        showMessage(msg, "Server error, try later");
      }
    });
  }
})();
