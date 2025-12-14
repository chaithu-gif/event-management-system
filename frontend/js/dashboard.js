// js/dashboard.js
// Shows events, handles registration, Razorpay demo and storing regs in localStorage

document.addEventListener('DOMContentLoaded', async () => {

  /* ================= AUTH PROTECTION ================= */
  const userData = localStorage.getItem('es_user');
  if (!userData) {
    // Not logged in → block dashboard
    window.location.href = 'index.html';
    return;
  }

  let EVENTS = [];

  const eventsGrid = document.getElementById('eventsGrid');
  const regsList = document.getElementById('registeredList');
  const displayName = document.getElementById('displayName');
  const modalRoot = document.getElementById('modalRoot');
  const modalContent = document.getElementById('modalContent');

  /* ================= SHOW USER ================= */
  try {
    const user = JSON.parse(userData);
    if (displayName) {
      displayName.textContent = user.name || 'User';
    }
  } catch (e) {
    if (displayName) displayName.textContent = 'User';
  }

  /* ================= RENDER EVENTS ================= */
  function renderEvents() {
    eventsGrid.innerHTML = '';
    EVENTS.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card card';

      const shortDesc = ev.description
        ? (ev.description.length > 120 ? ev.description.slice(0, 120) + '…' : ev.description)
        : '';

      card.innerHTML = `
        <img src="${ev.image}" alt="">
        <div class="event-meta">
          <div>
            <div class="title">${ev.title}</div>
            <div style="font-size:12px;color:var(--muted)">
              ${ev.date} • ${ev.venue}${ev.capacity ? ' • Capacity ' + ev.capacity : ''}
            </div>
          </div>
          <div class="price">${ev.price ? '₹' + ev.price : 'Free'}</div>
        </div>
        <div style="margin-top:6px;color:var(--muted);font-size:14px">${shortDesc}</div>
        ${ev.packages && ev.packages.length ? `
          <div style="margin-top:8px;color:#e6eefc">
            <strong>Packages</strong>
            <ul style="margin:6px 0 0 18px;color:var(--muted)">
              ${ev.packages.map(p =>
                `<li>${p.name} — ₹${p.price}${p.description ? ' • ' + p.description : ''}</li>`
              ).join('')}
            </ul>
          </div>` : ''}
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn register" data-id="${ev.id}">Register</button>
          <button class="btn ghost view" data-id="${ev.id}">View</button>
        </div>
      `;

      eventsGrid.appendChild(card);
    });
  }

  async function loadEvents() {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      EVENTS = data.map(ev => ({
        id: ev._id || ev.id,
        title: ev.title,
        date: ev.date ? new Date(ev.date).toISOString().split('T')[0] : '',
        venue: ev.location || ev.venue || '',
        price: ev.price || 0,
        image: ev.image || `https://picsum.photos/seed/${ev._id || ev.id}/600/400`,
        description: ev.description || '',
        capacity: ev.capacity || 0,
        packages: ev.packages || [],
        category: ev.category || ''
      }));
      renderEvents();
    } catch (e) {
      EVENTS = [
        { id: 1, title: 'Music Night', date: '2025-11-12', venue: 'Arena', price: 299, image: 'https://picsum.photos/seed/music/600/400' },
        { id: 2, title: 'Tech Meetup', date: '2025-11-05', venue: 'Hall A', price: 0, image: 'https://picsum.photos/seed/tech/600/400' },
        { id: 3, title: 'Art Workshop', date: '2025-12-01', venue: 'Studio', price: 199, image: 'https://picsum.photos/seed/art/600/400' }
      ];
      renderEvents();
    }
  }

  await loadEvents();

  /* ================= LOAD REGISTRATIONS ================= */
  function loadRegs() {
    const regs = JSON.parse(localStorage.getItem('es_regs') || '[]');
    regsList.innerHTML = '';
    regs.forEach(r => {
      const d = document.createElement('div');
      d.className = 'card';
      d.style.marginBottom = '8px';
      d.innerHTML = `
        <strong>${r.eventName}</strong>
        <div style="font-size:13px;color:var(--muted)">
          ${r.name} • ${r.status}
        </div>`;
      regsList.appendChild(d);
    });
  }
  loadRegs();

  /* ================= MODAL ================= */
  function openModal(html) {
    modalContent.innerHTML = html;
    modalRoot.style.display = 'flex';
  }
  function closeModal() {
    modalRoot.style.display = 'none';
    modalContent.innerHTML = '';
  }
  modalRoot.addEventListener('click', e => {
    if (e.target === modalRoot) closeModal();
  });

  /* ================= LOGOUT ================= */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('es_user');
      localStorage.removeItem('es_token');
      window.location.href = 'index.html';
    });
  }

});
