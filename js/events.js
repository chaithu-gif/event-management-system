// js/events.js
// Data (images via URLs). Edit URLs or add new subtypes as required.
const EVENT_DATA = {
  wedding: {
    title: "Wedding Celebrations",
    desc: "Full wedding planning — venue, decor, catering, photography and coordination.",
    subevents: [
      {
        id: "kerala",
        name: "Kerala Wedding",
        images: [
          "https://images.unsplash.com/photo-1549187774-b4e9b0445bde?w=1200",
          "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1200",
          "https://images.unsplash.com/photo-1518032922010-3b1d79b8b3f1?w=1200"
        ],
        programs: [
          "Traditional rituals",
          "Temple / Mandap setup",
          "Sangeet & Reception",
          "Classical musicians"
        ],
        priceBreakdown: { venue:150000, decor:50000, catering:100000, photo:40000 }
      },
      {
        id: "karnataka",
        name: "Karnataka Wedding",
        images: [
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200",
          "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1200"
        ],
        programs: ["Mandap rituals","Traditional cuisine","Live musicians"],
        priceBreakdown: { venue:140000, decor:45000, catering:90000, photo:35000 }
      },
      {
        id: "maharashtra",
        name: "Maharashtra Wedding",
        images: [
          "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200"
        ],
        programs: ["Vedic ceremony","Local specialties","Garba/night events"],
        priceBreakdown: { venue:130000, decor:40000, catering:95000, photo:30000 }
      }
    ]
  },

  birthday: {
    title: "Birthday Parties",
    desc: "Theme birthday planning for kids, adults and surprises.",
    subevents: [
      {
        id: "kids",
        name: "Kids Birthday",
        images: [
          "https://images.unsplash.com/photo-1520962910056-9e9b3b1f2b25?w=1200",
          "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?w=1200"
        ],
        programs: ["Theme décor","Games & activities","Clown/performers","Cake & treats"],
        priceBreakdown: { venue:20000, decor:8000, catering:15000, extras:5000 }
      },
      {
        id: "surprise",
        name: "Surprise Party",
        images: [
          "https://images.unsplash.com/photo-1504691342899-89b5a3a9a7b3?w=1200"
        ],
        programs: ["Secret coordination","Decor & lights","Catering & cake"],
        priceBreakdown: { venue:30000, decor:10000, catering:20000, extras:7000 }
      }
    ]
  },

  family: {
    title: "Family Ceremonies",
    desc: "Reunions, anniversaries, cultural family functions.",
    subevents: [
      {
        id: "reunion",
        name: "Family Reunion",
        images: [
          "https://images.unsplash.com/photo-1529006557819-2ff10af1d3c9?w=1200"
        ],
        programs: ["Games","Group meals","Photo booths"],
        priceBreakdown: { venue:40000, decor:8000, catering:30000 }
      }
    ]
  },

  corporate: {
    title: "Corporate Events",
    desc: "Conferences, seminars, team building activities.",
    subevents: [
      {
        id: "conference",
        name: "Conference",
        images: [
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200"
        ],
        programs: ["Stage & AV","Speakers","Catering","Workshops"],
        priceBreakdown: { venue:100000, AV:40000, catering:60000, staffing:20000 }
      }
    ]
  },

  concert: {
    title: "Concerts & Shows",
    desc: "Concerts, shows with full production.",
    subevents: [
      {
        id: "openair",
        name: "Open-Air Concert",
        images: [
          "https://images.unsplash.com/photo-1506152983158-bff7d48a2f38?w=1200"
        ],
        programs: ["Stage production","Lighting & sound","Security"],
        priceBreakdown: { stage:200000, lights:80000, crew:60000 }
      }
    ]
  },

  babyshower: {
    title: "Baby Showers",
    desc: "Cozy and luxury baby shower planning.",
    subevents: [
      {
        id: "intimate",
        name: "Intimate Gathering",
        images: [
          "https://images.unsplash.com/photo-1541872703-4a9769b2f3a4?w=1200"
        ],
        programs: ["Cake & refreshments","Games","Gifts & favours"],
        priceBreakdown: { venue:15000, decor:8000, catering:12000 }
      }
    ]
  }
};

// Utility to format INR
function formatINR(n){ return "₹" + Number(n).toLocaleString('en-IN'); }

// Build category grid on load
function buildCategories(){
  const container = document.getElementById('mainContainer');
  container.innerHTML = '';
  Object.keys(EVENT_DATA).forEach(key => {
    const cat = EVENT_DATA[key];
    const card = document.createElement('div');
    card.className = 'event-card';
    // first image of first subtype used as card image (fallback)
    const sampleImg = (cat.subevents && cat.subevents[0] && cat.subevents[0].images && cat.subevents[0].images[0]) || '';
    card.innerHTML = `
      <img src="${sampleImg}" alt="${cat.title}">
      <h2>${cat.title}</h2>
      <p>${cat.desc || ''}</p>
      <div class="center-controls">
        <button class="btn" onclick="showSubEvents('${key}')">Explore Now</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// show subtypes for a category
function showSubEvents(categoryKey){
  const data = EVENT_DATA[categoryKey];
  document.getElementById('mainContainer').classList.add('hidden');
  document.getElementById('detailSection').classList.add('hidden');

  const sec = document.getElementById('subEventSection');
  sec.innerHTML = `<div class="container-section"><h2 style="text-align:center;color:#fff">${data.title}</h2>
    <div class="event-subtype-container">
      ${data.subevents.map(s => `
        <div class="event-card">
          <img src="${s.images[0]}" alt="${s.name}">
          <h3>${s.name}</h3>
          <p>${(s.desc || '').slice(0,120)}</p>
          <div class="center-controls">
            <button class="btn" onclick="showEventDetails('${categoryKey}','${s.id}')">Explore Now</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="center-controls"><button class="btn ghost" onclick="goBackToMain()">Back</button></div>
  </div>`;
  sec.classList.remove('hidden');
  window.scrollTo({top:0, behavior:'smooth'});
}

// show detail view for a subtype
function showEventDetails(categoryKey, subtypeId){
  const cat = EVENT_DATA[categoryKey];
  const s = cat.subevents.find(x=>x.id === subtypeId);
  if(!s) return alert('Not found');

  document.getElementById('subEventSection').classList.add('hidden');

  // calculate total
  const prices = s.priceBreakdown || {};
  const total = Object.values(prices).reduce((a,b)=>a+ (Number(b)||0), 0);

  const detailSection = document.getElementById('detailSection');
  detailSection.innerHTML = `
    <div class="container-section">
      <h2 style="text-align:center;color:#ffcc00">${s.name}</h2>

      <div class="gallery">
        ${s.images.map(src => `<img src="${src}" alt="${s.name}">`).join('')}
      </div>

      <div class="event-info">
        <p>${s.desc || ''}</p>

        <h3 style="color:#ffcc00;margin-top:10px">Programs We Offer</h3>
        <ul>
          ${(s.programs||[]).map(p=>`<li>• ${p}</li>`).join('')}
        </ul>

        <h3 style="color:#ffcc00;margin-top:10px">Estimated Expenses</h3>
        <ul>
          ${Object.keys(prices).map(k=>`<li>${k.charAt(0).toUpperCase()+k.slice(1)}: <strong>${formatINR(prices[k])}</strong></li>`).join('')}
        </ul>
        <p style="margin-top:10px"><strong>Total: ${formatINR(total)}</strong></p>

        <div style="margin-top:14px" class="center-controls">
          <button class="btn" onclick="startRegistration('${categoryKey}','${subtypeId}')">Register & Pay</button>
          <button class="btn ghost" onclick="backToSub('${categoryKey}')">Back</button>
        </div>
      </div>
    </div>
  `;
  detailSection.classList.remove('hidden');
  window.scrollTo({top:0, behavior:'smooth'});
}

// back helpers
function backToSub(category){ document.getElementById('detailSection').classList.add('hidden'); showSubEvents(category); }
function goBackToMain(){ document.getElementById('subEventSection').classList.add('hidden'); document.getElementById('mainContainer').classList.remove('hidden'); }

// registration stub
function startRegistration(category, subtype){
  // For now: show a simple prompt flow and redirect to payment page (or open payment modal)
  const name = prompt("Your name:");
  if(!name) return;
  const email = prompt("Email for contact:");
  if(!email) return;
  alert("Registration recorded (demo). Redirecting to payment page...");
  // example redirect to payment page with query params (implement payment page separately)
  const redirectUrl = `payment.html?category=${encodeURIComponent(category)}&subtype=${encodeURIComponent(subtype)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
  window.location.href = redirectUrl;
}

// bootstrap
document.addEventListener('DOMContentLoaded', () => buildCategories());
