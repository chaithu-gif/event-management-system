(async () => {
  const BASE_URL = "http://localhost:5000/api/user";

  function showMessage(el, msg, color = "red") {
    el.style.color = color;
    el.textContent = msg;
  }

  /* ====================== SIGNUP ====================== */
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

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

        if (!res.ok) {
          showMessage(msg, data.msg || "Signup failed");
          return;
        }

        // Save auth data
        localStorage.setItem("es_token", data.token);
        localStorage.setItem(
          "es_user",
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: "customer",
          })
        );

        showMessage(msg, "Signup successful! Redirecting...", "#7c5cff");
        setTimeout(() => {
          window.location.href = "customer-dashboard.html";
        }, 800);

      } catch (err) {
        console.error(err);
        showMessage(msg, "Server error");
      }
    });
  }

  /* ====================== LOGIN ====================== */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const msg = document.getElementById("loginMsg");

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

        if (!res.ok) {
          showMessage(msg, data.msg || "Invalid email or password");
          return;
        }

        // Save auth data (IMPORTANT)
        localStorage.setItem("es_token", data.token);
        localStorage.setItem(
          "es_user",
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: "customer",
          })
        );

        showMessage(msg, "Login successful! Redirecting...", "#7c5cff");
        setTimeout(() => {
          window.location.href = "customer-dashboard.html";
        }, 800);

      } catch (err) {
        console.error(err);
        showMessage(msg, "Server error");
      }
    });
  }

})();
