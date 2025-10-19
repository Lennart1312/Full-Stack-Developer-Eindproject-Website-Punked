let featuredItems = []; // Later: array of merch objects

function loadFeaturedMerch() {
    const grid = document.getElementById("featured-grid");
    grid.innerHTML = ""; // Clear previous cards

    featuredItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-genre", item.genre || "misc");

        card.innerHTML = `
            <div class="click-to-view">
                <div class="image-placeholder">
                    <span class="condition-dot ${item.condition}"></span>
                </div>
            </div>
            <span class="genre-tag">${item.genre}</span>
            <h4>${item.title}</h4>
            <p>€${item.price}</p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;

        // 🛒 Add to Cart Button
        const addButton = card.querySelector('.add-to-cart-btn');
        addButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Avoid bubbling to the image click
            const confirmAdd = confirm(`Add "${item.title}" to your shopping cart for €${item.price}?`);
            if (confirmAdd) {
                addToCart(item.title, item.price);
            }
        });

        // 🖱️ Only image area opens Product.html
        const viewArea = card.querySelector('.click-to-view');
        viewArea.addEventListener('click', () => {
            localStorage.setItem("selectedProduct", JSON.stringify(item));
            window.location.href = "Product.html";
        });

        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const genres = ["rock", "metal", "punk", "indie", "hiphop", "electronic", "jazz", "pop"];
    const conditions = ["good", "slightly", "damaged"];


    featuredItems = Array.from({ length: 40 }, (_, i) => ({
        title: `Item ${i + 1}`,
        price: (Math.random() * 40 + 10).toFixed(2),
        image: "../Assets/Placeholder.png", // Replace with real images later
        genre: genres[Math.floor(Math.random() * genres.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)]
    }));

    loadFeaturedMerch();
});
