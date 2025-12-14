// js/dashboard.js
// Shows events, handles registration, Razorpay demo and storing regs in localStorage
document.addEventListener('DOMContentLoaded', async () => {
  let EVENTS = [];

  const eventsGrid = document.getElementById('eventsGrid');
  const regsList = document.getElementById('registeredList');
  const displayName = document.getElementById('displayName');
  const modalRoot = document.getElementById('modalRoot');
  const modalContent = document.getElementById('modalContent');

  // show user
  try {
    const user = JSON.parse(localStorage.getItem('es_user') || '{}');
    displayName.textContent = user.name || 'Guest';
  } catch(e){ displayName.textContent = 'Guest' }

  // render events
  function renderEvents(){
    eventsGrid.innerHTML = '';
    EVENTS.forEach(ev=>{
      const card = document.createElement('div');
      card.className = 'event-card card';
      const shortDesc = ev.description ? (ev.description.length > 120 ? ev.description.slice(0,120) + '…' : ev.description) : '';
      card.innerHTML = `
        <img src="${ev.image}" alt="">
        <div class="event-meta">
          <div>
            <div class="title">${ev.title}</div>
            <div style="font-size:12px;color:var(--muted)">${ev.date} • ${ev.venue}${ev.capacity? ' • Capacity '+ev.capacity:''}</div>
          </div>
          <div class="price">${ev.price? '₹'+ev.price:'Free'}</div>
        </div>
        <div style="margin-top:6px;color:var(--muted);font-size:14px">${shortDesc}</div>
        ${ev.packages && ev.packages.length ? `<div style="margin-top:8px;color:#e6eefc"><strong>Packages</strong><ul style="margin:6px 0 0 18px;color:var(--muted)">${ev.packages.map(p=>`<li>${p.name} — ₹${p.price}${p.description? ' • '+p.description:''}</li>`).join('')}</ul></div>` : ''}
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn register" data-id="${ev.id}">Register</button>
          <button class="btn ghost view" data-id="${ev.id}">View</button>
        </div>
      `;
      eventsGrid.appendChild(card);
    });
  }
  
  async function loadEvents(){
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      EVENTS = data.map(ev => ({
          id: ev._id || ev.id,
          title: ev.title,
          date: ev.date ? new Date(ev.date).toISOString().split('T')[0] : '',
          venue: ev.location || ev.venue || '',
          price: ev.price || 0,
          image: ev.image || ('https://picsum.photos/seed/' + (ev._id||ev.id||Math.random()) + '/600/400'),
          description: ev.description || '',
          capacity: ev.capacity || 0,
          packages: ev.packages || [],
          category: ev.category || ''
      }));
      renderEvents();
    } catch (e) {
      console.warn('Could not load events from API, falling back to sample data.', e.message);
      // fallback sample
      EVENTS = [
        {id:1,title:'Music Night',date:'2025-11-12',venue:'Arena',price:299,image:'https://picsum.photos/seed/music/600/400'},
        {id:2,title:'Tech Meetup',date:'2025-11-05',venue:'Hall A',price:0,image:'https://picsum.photos/seed/tech/600/400'},
        {id:3,title:'Art Workshop',date:'2025-12-01',venue:'Studio',price:199,image:'https://picsum.photos/seed/art/600/400'}
      ];
      renderEvents();
    }
  }

  await loadEvents();

  // socket.io: refresh events when server notifies changes
  try {
    if (window.io) {
      const socket = io();
      socket.on('connect', () => console.log('Connected to events socket'));
      socket.on('eventsUpdated', (msg) => {
        console.log('eventsUpdated received', msg);
        loadEvents();
      });
    }
  } catch (e) { console.warn('Socket error', e.message); }

  // load registrations
  function loadRegs(){
    const regs = JSON.parse(localStorage.getItem('es_regs')||'[]');
    regsList.innerHTML = '';
    regs.forEach(r=>{
      const d = document.createElement('div');
      d.className='card';
      d.style.marginBottom='8px';
      d.innerHTML = `<strong>${r.eventName}</strong><div style="font-size:13px;color:var(--muted)">${r.name} • ${r.status}</div>`;
      regsList.appendChild(d);
    });
  }
  loadRegs();

  // modal helpers
  function openModal(html){ modalContent.innerHTML = html; modalRoot.style.display='flex'; }
  function closeModal(){ modalRoot.style.display='none'; modalContent.innerHTML=''; }
  modalRoot.addEventListener('click', (e)=>{ if(e.target===modalRoot) closeModal(); });

  // register handler
  document.body.addEventListener('click', (e)=>{
    if (e.target.matches('.register')) {
      const id = e.target.dataset.id;
      const ev = EVENTS.find(x=>String(x.id)===String(id));
      openModal(`
        <h3>${ev.title}</h3>
        <p>${ev.date} • ${ev.venue}</p>
        <input id="r_name" placeholder="Your name" style="width:100%;padding:8px;margin:8px 0;border-radius:8px">
        <input id="r_email" placeholder="Email" style="width:100%;padding:8px;margin-bottom:8px;border-radius:8px">
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="btn ghost" id="cancelReg">Cancel</button>
          <button class="btn" id="payReg">${ev.price? 'Pay & Register':'Register'}</button>
        </div>
      `);
      document.getElementById('cancelReg').addEventListener('click', closeModal);
      document.getElementById('payReg').addEventListener('click', async ()=>{
        const name = document.getElementById('r_name').value.trim();
        const email = document.getElementById('r_email').value.trim();
        if (!name || !email) { alert('Enter name & email'); return; }
        const regs = JSON.parse(localStorage.getItem('es_regs')||'[]');
        const reg = {id:Date.now(), eventId:ev.id, eventName:ev.title, name, email, status: ev.price? 'pending':'registered', createdAt: new Date().toISOString()};
        regs.push(reg); localStorage.setItem('es_regs', JSON.stringify(regs));
        closeModal();
        loadRegs();
        // if paid event -> open Razorpay checkout demo
        if (ev.price) {
          const options = {
            key: 'rzp_test_1DP5mmOlF5G5ag', // REPLACE with your key for real
            amount: ev.price * 100,
            currency: 'INR',
            name: 'EventSphere (demo)',
            description: ev.title,
            handler: function(response){
              // mark as paid locally
              const regs2 = JSON.parse(localStorage.getItem('es_regs')||'[]');
              const r = regs2.find(x=>x.id===reg.id);
              if (r) r.status = 'paid', r.paymentId = response.razorpay_payment_id;
              localStorage.setItem('es_regs', JSON.stringify(regs2));
              loadRegs();
              alert('Payment success (demo). Confirmation email would be sent by server.');
              // optional: POST to backend /api/send-email
            },
            prefill: {name,email}
          };
          const rzp = new Razorpay(options);
          rzp.open();
        } else {
          alert('Registered (Free). Confirmation email would be sent (demo).');
        }
      });
    }

    if (e.target.matches('.view')) {
      const id = e.target.dataset.id;
      const ev = EVENTS.find(x=>String(x.id)===String(id));
      if (ev && ev.category) {
        // if category corresponds to a template page, open that page with ?id=<eventId>
        window.location.href = `${ev.category}.html?id=${encodeURIComponent(ev.id)}`;
        return;
      }
      const pkgHtml = ev.packages && ev.packages.length ? `<h4>Packages</h4><ul style="color:var(--muted)">${ev.packages.map(p=>`<li>${p.name} — ₹${p.price}${p.description? ' • '+p.description:''}</li>`).join('')}</ul>` : '';
      openModal(`<h3>${ev.title}</h3><img src="${ev.image}" style="width:100%;border-radius:8px"><p style="margin:6px 0;color:var(--muted)">${ev.date} • ${ev.venue}${ev.location? ' • '+ev.location:''}</p><p style="color:#e6eefc">${ev.description||''}</p>${pkgHtml}<div style="text-align:right"><button class="btn" onclick="document.getElementById('modalRoot').style.display='none'">Close</button></div>`);
    }
  });

  // logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', ()=> {
    localStorage.removeItem('es_token');
    location.href = 'index.html';
  });

  // theme toggle
  const togg = document.getElementById('toggleTheme');
  if (togg) togg.addEventListener('click', ()=> document.body.classList.toggle('dark-mode'));

});
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear stored user/session data
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to home page
      window.location.href = "index.html";
    });
  }
});

