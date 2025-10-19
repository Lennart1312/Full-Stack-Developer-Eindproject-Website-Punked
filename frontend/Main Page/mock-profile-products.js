// Make mock data global so it can be modified by remove action
const mockListings = [
    { title: "Tour Hoodie", price: "34.99", image: "../Assets/hoodie.png", genre: "Metal", condition: "New" },
    { title: "Band Pin Set", price: "9.99", image: "../Assets/pins.png", genre: "Punk", condition: "Used" },
    { title: "Concert T-Shirt", price: "19.99", image: "../Assets/tshirt.png", genre: "Rock", condition: "New" },
    { title: "Signed Poster", price: "45.00", image: "../Assets/poster.png", genre: "Rock", condition: "Mint" },
    { title: "Vinyl LP", price: "22.00", image: "../Assets/vinyl.png", genre: "Jazz", condition: "Good" },
    { title: "Guitar Picks", price: "4.99", image: "../Assets/picks.png", genre: "Misc", condition: "New" },
    { title: "Leather Jacket", price: "120.00", image: "../Assets/jacket.png", genre: "Metal", condition: "Used" },
];

const mockHistory = [
    { title: "Live Concert Poster", price: "12.00", image: "../Assets/poster2.png", genre: "Rock", condition: "New" },
    { title: "Classic Vinyl", price: "30.00", image: "../Assets/vinyl2.png", genre: "Jazz", condition: "Used" },
    { title: "Festival Ticket", price: "75.00", image: "../Assets/ticket.png", genre: "Pop", condition: "New" },
];

const mockFavorites = [
    { title: "Limited Edition Hoodie", price: "55.00", image: "../Assets/hoodie2.png", genre: "Metal", condition: "New" },
    { title: "Rare Band Poster", price: "40.00", image: "../Assets/poster3.png", genre: "Rock", condition: "Mint" },
    { title: "Collector Pins", price: "15.00", image: "../Assets/pins2.png", genre: "Punk", condition: "New" },
    { title: "Autographed CD", price: "25.00", image: "../Assets/cd.png", genre: "Pop", condition: "Good" },
    { title: "Custom Guitar Strap", price: "35.00", image: "../Assets/strap.png", genre: "Misc", condition: "New" },
];

function createProductCard(item, sectionId, index) {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <div class="image2-placeholder">
            <img src="${item.image || '../Assets/nothing.png'}" alt="${item.title}" />
        </div>
        <span class="genre-tag">${item.genre || 'Misc'}${item.condition ? ` (${item.condition})` : ''}</span>
        <h4>${item.title}</h4>
        <p>€${item.price}</p>
        <button class="remove-btn" title="Remove product">✖</button>
    `;

    // Add event listener to remove button
    card.querySelector(".remove-btn").addEventListener("click", () => {
        removeProduct(sectionId, index);
    });

    return card;
}

function removeProduct(sectionId, index) {
    switch(sectionId) {
        case "listings":
            mockListings.splice(index, 1);
            loadProfileSection(sectionId, mockListings);
            break;
        case "history":
            mockHistory.splice(index, 1);
            loadProfileSection(sectionId, mockHistory);
            break;
        case "favorites":
            mockFavorites.splice(index, 1);
            loadProfileSection(sectionId, mockFavorites);
            break;
    }
}

function loadProfileSection(sectionId, products) {
    const container = document.querySelector(`#${sectionId} .profile-grid`);
    if (!container) return;

    container.innerHTML = ""; // Clear existing cards

    if (products.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No products to show yet.";
        container.appendChild(msg);
        return;
    }

    products.forEach((product, idx) => {
        const card = createProductCard(product, sectionId, idx);
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadProfileSection("listings", mockListings);
    loadProfileSection("history", mockHistory);
    loadProfileSection("favorites", mockFavorites);

    // Setup scrolling buttons for each profile grid wrapper
    document.querySelectorAll(".profile-grid-wrapper").forEach(wrapper => {
        const grid = wrapper.querySelector(".profile-grid");
        const btnLeft = wrapper.querySelector(".scroll-btn-left");
        const btnRight = wrapper.querySelector(".scroll-btn-right");
        const scrollAmount = 300; // Adjust scroll distance

        if (btnLeft && grid) {
            btnLeft.addEventListener("click", () => {
                grid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            });
        }

        if (btnRight && grid) {
            btnRight.addEventListener("click", () => {
                grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
            });
        }
    });
});
