// js/admin.js
document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------
  // CONFIG: Admin Credentials
  // ------------------------------
  const ADMIN_EMAIL = "admin@eventsphere.com";
  const ADMIN_PASSWORD = "admin123";
  const ADMIN_SECRET = "event$phere2025";

  const currentPage = window.location.pathname.split("/").pop();

  // ------------------------------
  // ADMIN LOGIN PAGE
  // ------------------------------
  if (currentPage === "admin-login.html") {
    const form = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("adminEmail");
    const passwordInput = document.getElementById("adminPassword");
    const secretInput = document.getElementById("adminSecret");
    const msg = document.getElementById("adminMsg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const secret = secretInput.value.trim();

      if (!email || !password || !secret) {
        msg.style.color = "red";
        msg.textContent = "All fields are required!";
        return;
      }

      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        msg.style.color = "red";
        msg.textContent = "Invalid email or password!";
        return;
      }

      if (secret !== ADMIN_SECRET) {
        msg.style.color = "red";
        msg.textContent = "Invalid secret passkey!";
        return;
      }

      localStorage.setItem("loggedAdmin", JSON.stringify({ email: ADMIN_EMAIL }));
      msg.style.color = "green";
      msg.textContent = "Login successful! Redirecting...";

      setTimeout(() => window.location.href = "admin-dashboard.html", 800);
    });

    return; // Skip dashboard logic if on login page
  }

  // ------------------------------
  // ADMIN DASHBOARD PAGE
  // ------------------------------
  const admin = JSON.parse(localStorage.getItem("loggedAdmin"));
  if (!admin) {
    window.location.href = "admin-login.html";
    return;
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedAdmin");
      window.location.href = "admin-login.html";
    });
  }

  // ------------------------------
  // Dashboard actions
  // ------------------------------
  const btnAdd = document.getElementById('btnAddEvent');
  const exportCSV = document.getElementById('exportCSV');
  const genQR = document.getElementById('genQR');
  const regsList = document.getElementById('regsList');

  function loadRegsUI() {
    const regs = JSON.parse(localStorage.getItem('es_regs') || '[]');
    regsList.innerHTML = regs.length
      ? regs.map(r => `<div class="card" style="margin-bottom:8px"><strong>${r.eventName}</strong>
        <div style="font-size:13px;color:var(--muted)">${r.name} • ${r.email} • ${r.status}</div></div>`).join('')
      : '<p style="color:var(--muted)">No registrations yet.</p>';
  }
  loadRegsUI();

  // Add Event
  btnAdd.addEventListener('click', async () => {
    const secret = (document.getElementById('adminSecret') || {}).value || '';
    const title = prompt('Event title (demo)');
    if (!title) return;

    const payload = { title, date: '2026-01-01', price: 199, image: 'https://picsum.photos/seed/new/600/400' };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Event created (server accepted).');
      } else {
        const txt = await res.text();
        alert('Server error: ' + txt + ' — adding locally (demo).');
        let evs = JSON.parse(localStorage.getItem('es_events') || '[]');
        payload.id = Date.now();
        evs.push(payload);
        localStorage.setItem('es_events', JSON.stringify(evs));
      }
    } catch (e) {
      payload.id = Date.now();
      let evs = JSON.parse(localStorage.getItem('es_events') || '[]');
      evs.push(payload);
      localStorage.setItem('es_events', JSON.stringify(evs));
      alert('No server — event added locally (demo).');
    }
  });

  // Export CSV
  exportCSV.addEventListener('click', () => {
    const regs = JSON.parse(localStorage.getItem('es_regs') || '[]');
    if (!regs.length) { alert('No registrations'); return; }

    const hdr = ['id', 'eventId', 'eventName', 'name', 'email', 'status'];
    const csv = [hdr.join(',')].concat(
      regs.map(r => [r.id, r.eventId, r.eventName, r.name, r.email, r.status].map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'registrations.csv'; a.click();
    URL.revokeObjectURL(url);
  });

  // Generate QR
  genQR.addEventListener('click', () => {
    const evId = prompt('Event ID to generate QR for (demo):');
    if (!evId) return;
    const url = `https://example.com/event/${evId}`;
    const img = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(url)}`;
    const w = window.open('', '_blank', 'width=260,height=320');
    w.document.write(`<img src="${img}" alt="qr"><p style="font-family:Inter,Arial">${url}</p>`);
  });

});
