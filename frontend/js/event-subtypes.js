const subtypes = {
    wedding: [
        { name: "Kerala Wedding", slug: "kerala-wedding" },
        { name: "Beach Wedding", slug: "beach-wedding" },
        { name: "Destination Wedding", slug: "destination-wedding" }
    ],
    birthday: [
        { name: "Kids Birthday", slug: "kids-birthday" },
        { name: "Adult Birthday", slug: "adult-birthday" }
    ],
    corporate: [
        { name: "Team Event", slug: "team-event" },
        { name: "Conference", slug: "conference" }
    ],
    anniversary: [
        { name: "Silver Anniversary", slug: "silver-anniversary" },
        { name: "Golden Anniversary", slug: "golden-anniversary" }
    ]
};

const params = new URLSearchParams(window.location.search);
const event = params.get("event");

document.getElementById("event-title").innerText = `${capitalize(event)} Subtypes`;

const container = document.getElementById("subtype-container");

if(subtypes[event]) {
    subtypes[event].forEach(sub => {
        const div = document.createElement("div");
        div.className = "event-card";
        div.innerHTML = `
            <h2>${sub.name}</h2>
            <button onclick="viewDetails('${event}','${sub.slug}')">View Details</button>
        `;
        container.appendChild(div);
    });
}

function viewDetails(eventSlug, subtypeSlug) {
    window.location.href = `event-details.html?event=${eventSlug}&subtype=${subtypeSlug}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
