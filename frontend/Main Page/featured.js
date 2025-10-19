async function loadFeaturedMerch() {
    const grid = document.getElementById("featured-grid");
    grid.innerHTML = "<p>Loading featured items...</p>";

    try {
        const res = await fetch("http://localhost:8080/api/products");
        if (!res.ok) throw new Error("Failed to fetch featured products");

        const products = await res.json();
        grid.innerHTML = ""; // Clear loading text

        products.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-genre", item.genre || "misc");

            card.innerHTML = `
                <div class="click-to-view">
                    <div class="image-placeholder">
                        <img src="${item.imageUrl || '../Assets/Placeholder.png'}" alt="${item.title}">
                    </div>
                </div>
                <span class="genre-tag">${item.genre || "Misc"}</span>
                <h4>${item.title}</h4>
                <p>€${item.price.toFixed(2)}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            `;

            // 🛒 Add to Cart Button
            const addButton = card.querySelector('.add-to-cart-btn');
            addButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const confirmAdd = confirm(`Add "${item.title}" to your shopping cart for €${item.price}?`);
                if (confirmAdd) addToCart(item.title, item.price);
            });

            // 🖱️ Click image to open Product.html
            const viewArea = card.querySelector('.click-to-view');
            viewArea.addEventListener('click', () => {
                localStorage.setItem("selectedProductId", item.id);
                window.location.href = "Product.html";
            });

            grid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = "<p>Failed to load featured products.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadFeaturedMerch);
