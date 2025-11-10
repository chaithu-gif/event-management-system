// Future enhancements like dark mode, floating button, or AI animations can go here
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");

  const eventData = {
    "kerala-wedding": {
      title: "Kerala Wedding",
      images: [
        "https://images.unsplash.com/photo-1583939003579-730e391b6b47",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "https://images.unsplash.com/photo-1579493939860-4321d8e2d8b9"
      ],
      desc: "A traditional Kerala wedding with authentic cultural rituals and elegant temple-themed décor.",
      expenses: [
        "Venue: ₹1,50,000",
        "Decoration: ₹70,000",
        "Catering: ₹1,20,000",
        "Photography: ₹50,000"
      ]
    },
    "beach-wedding": {
      title: "Beach Wedding",
      images: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        "https://images.unsplash.com/photo-1489619447083-3b0c22f68ed7",
        "https://images.unsplash.com/photo-1519741497674-611481863552"
      ],
      desc: "Say ‘I do’ by the waves with a breezy beach setup and sunset ambiance.",
      expenses: [
        "Venue: ₹2,00,000",
        "Decoration: ₹90,000",
        "Catering: ₹1,50,000",
        "Photography: ₹60,000"
      ]
    },
    "destination-wedding": {
      title: "Destination Wedding",
      images: [
        "https://images.unsplash.com/photo-1536240478700-b869070f9279",
        "https://images.unsplash.com/photo-1524813686514-a57563d77965",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      ],
      desc: "Celebrate your special day at exotic destinations with luxurious settings.",
      expenses: [
        "Venue & Travel: ₹3,00,000",
        "Decoration: ₹1,00,000",
        "Catering: ₹2,00,000",
        "Photography: ₹70,000"
      ]
    },
    "kids-birthday": {
      title: "Kids Birthday Party",
      images: [
        "https://images.unsplash.com/photo-1542327897-37fa1ff59b89",
        "https://images.unsplash.com/photo-1613084588774-5eea3f41b546",
        "https://images.unsplash.com/photo-1622584455421-56ad6e2a4db3"
      ],
      desc: "Fun and colorful setups with themes and games for kids.",
      expenses: [
        "Venue: ₹50,000",
        "Decoration: ₹30,000",
        "Cake & Food: ₹40,000",
        "Entertainment: ₹20,000"
      ]
    },
    "surprise-birthday": {
      title: "Surprise Birthday Party",
      images: [
        "https://images.unsplash.com/photo-1600607687920-4e74aabb54d9",
        "https://images.unsplash.com/photo-1599785209707-6c0c90b287e6",
        "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92"
      ],
      desc: "Plan a surprise birthday with decorations, music, and fun.",
      expenses: [
        "Venue: ₹70,000",
        "Decoration: ₹30,000",
        "Food: ₹60,000",
        "Photography: ₹25,000"
      ]
    },
    "theme-birthday": {
      title: "Theme Birthday Party",
      images: [
        "https://images.unsplash.com/photo-1584697964191-3a0e5b8b36cb",
        "https://images.unsplash.com/photo-1613084588774-5eea3f41b546",
        "https://images.unsplash.com/photo-1622584455421-56ad6e2a4db3"
      ],
      desc: "Pick your favorite theme — from superheroes to fairytales!",
      expenses: [
        "Venue: ₹80,000",
        "Decoration: ₹50,000",
        "Food: ₹70,000",
        "Entertainment: ₹40,000"
      ]
    },
    "conference": {
      title: "Business Conference",
      images: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        "https://images.unsplash.com/photo-1581093588401-22d89d57c3d1",
        "https://images.unsplash.com/photo-1551836022-4c4c79ecde51"
      ],
      desc: "Professional conference setups with seamless A/V systems.",
      expenses: [
        "Venue: ₹1,50,000",
        "Decoration: ₹50,000",
        "Equipment: ₹70,000",
        "Refreshments: ₹40,000"
      ]
    },
    "seminar": {
      title: "Educational Seminar",
      images: [
        "https://images.unsplash.com/photo-1581093588401-22d89d57c3d1",
        "https://images.unsplash.com/photo-1552664730-d307ca884978",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
      ],
      desc: "Impactful seminars with interactive learning experiences.",
      expenses: [
        "Venue: ₹1,00,000",
        "Speakers: ₹80,000",
        "Refreshments: ₹40,000",
        "Equipment: ₹30,000"
      ]
    },
    "team-building": {
      title: "Team Building Activities",
      images: [
        "https://images.unsplash.com/photo-1515169067865-5387ec356754",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        "https://images.unsplash.com/photo-1561484930-998b6a7f79f8"
      ],
      desc: "Fun outdoor and indoor team bonding sessions.",
      expenses: [
        "Venue: ₹80,000",
        "Activities: ₹60,000",
        "Catering: ₹50,000",
        "Logistics: ₹40,000"
      ]
    }
  };

  const event = eventData[type];
  if (!event) return;

  document.getElementById("eventTitle").textContent = event
