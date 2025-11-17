// js/auth.js (NO BACKEND VERSION)
// Fully working signup + login WITHOUT server.

(() => {

  // Helper
  function showMessage(el, msg, color = "red") {
    el.style.color = color;
    el.textContent = msg;
  }

  // SIGNUP
  const doSignupBtn = document.getElementById("doSignup");
  if (doSignupBtn) {
    doSignupBtn.addEventListener("click", () => {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("su_email").value.trim();
      const password = document.getElementById("su_password").value.trim();
      const msg = document.getElementById("signupMsg");

      if (!name || !email || !password) {
        showMessage(msg, "Please fill all fields");
        return;
      }

      // check if account exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some(u => u.email === email)) {
        showMessage(msg, "Account already exists");
        return;
      }

      // save user
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      showMessage(msg, "Account created successfully! Redirecting...", "#7c5cff");

      setTimeout(() => (window.location.href = "index.html"), 1200);
    });
  }


  // LOGIN
  const doLoginBtn = document.getElementById("doLogin");
  if (doLoginBtn) {
    doLoginBtn.addEventListener("click", () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const msg = document.getElementById("loginMsg");

      if (!email || !password) {
        showMessage(msg, "Enter email and password");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find(u => u.email === email && u.password === password);

      if (!found) {
        showMessage(msg, "Invalid email or password");
        return;
      }
 localStorage.setItem("loggedInUser", JSON.stringify(found));
      showMessage(msg, "Login successful! Redirecting...", "#7c5cff");

      setTimeout(() => (window.location.href = "customer-dashboard.html"), 1200);
    });
  }

})();
