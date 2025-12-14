// template-loader.js
// Generic loader for template pages. If page is opened with ?id=<eventId>,
// fetches /api/events/:id and replaces heading/description and package lists.
(async function(){
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    const res = await fetch('/api/events/' + encodeURIComponent(id));
    if (!res.ok) return;
    const ev = await res.json();

    // Update common parts if present
    const h1 = document.querySelector('h1');
    if (h1 && ev.title) h1.textContent = ev.title;
    const mainH2 = document.querySelector('.event-info h2');
    if (mainH2 && ev.title) mainH2.textContent = ev.title;
    const mainP = document.querySelector('.event-info p');
    if (mainP && ev.description) mainP.textContent = ev.description;

    // Packages container variations
    const pkgContainer = document.querySelector('.packages-container');
    const subtypeContainer = document.querySelector('.event-subtype-container');
    const container = pkgContainer || subtypeContainer;
    if (!container) return;
    container.innerHTML = '';

    const pkgs = ev.packages || [];
    if (!pkgs.length) {
      container.innerHTML = '<div style="color:#fff">No packages defined for this event.</div>';
      return;
    }

    pkgs.forEach(p => {
      // determine markup based on container type
      if (pkgContainer) {
        const d = document.createElement('div');
        d.className = 'service-package';
        d.innerHTML = `<h4>${p.name}</h4><ul>${(p.description? '<li>'+p.description+'</li>' : '')}<li><strong>Price: ₹${p.price}</strong></li></ul><button class="btn" onclick="window.location.href='payment.html'">Register Now</button>`;
        container.appendChild(d);
      } else {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `<img src='${ev.image||"https://picsum.photos/300/200"}' alt=''><h3>${p.name}</h3><p>${p.description||''}</p><p><strong>Price: ₹${p.price}</strong></p><div style="padding:10px"><button class="btn" onclick="window.location.href='payment.html'">Register</button></div>`;
        container.appendChild(card);
      }
    });

    // optional: update page image/background
    if (ev.image) {
      // if there's a hero/banner image element, set it; otherwise set body background (some templates expect that)
      const heroImg = document.querySelector('.hero-image');
      if (heroImg) heroImg.src = ev.image; else document.body.style.backgroundImage = `url('${ev.image}')`;
    }

  } catch (e) { console.warn('Template loader error', e && e.message); }
})();
