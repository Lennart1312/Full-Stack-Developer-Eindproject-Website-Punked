document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token"); // Bearer token

    // Helper: API call to delete product by ID
    async function deleteProductFromBackend(productId) {
        if (!token) {
            alert("You must be logged in to delete products.");
            return false;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to delete product from server");
            return true;
        } catch (err) {
            console.error(err);
            alert("Failed to delete product from server. Check console for details.");
            return false;
        }
    }

    // Extended createProductCard to add a remove button
    function createProductCardWithRemove(item, index, storageKey) {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
          <div class="image2-placeholder">
            <img src="${item.image || '../Assets/nothing.png'}" alt="${item.title}" />
          </div>
          <button class="remove-btn" title="Remove product">&times;</button>
          <span class="genre-tag">${item.genre || 'Misc'}${item.condition ? ` (${item.condition})` : ''}</span>
          <h4>${item.title}</h4>
          <p>€${item.price}</p>
        `;

        // Remove button handler
        card.querySelector(".remove-btn").addEventListener("click", async () => {
            if (!confirm("Are you sure you want to remove this product?")) return;

            // First try to remove from backend
            const success = item.id ? await deleteProductFromBackend(item.id) : true;

            if (success) {
                // Remove from localStorage too
                let products = JSON.parse(localStorage.getItem(storageKey)) || [];
                products.splice(index, 1);
                localStorage.setItem(storageKey, JSON.stringify(products));
                loadProfileSectionWithDelete(storageKey);
            }
        });

        return card;
    }

    // Load profile section with removal buttons
    function loadProfileSectionWithDelete(storageKey) {
        const sectionId = storageKey === "newProducts" ? "listings"
            : storageKey === "orderHistory" ? "history"
                : "favorites";
        const container = document.querySelector(`#${sectionId} .profile-grid`);
        if (!container) return;

        const products = JSON.parse(localStorage.getItem(storageKey)) || [];

        container.innerHTML = ""; // Clear

        if (products.length === 0) {
            const msg = document.createElement("p");
            msg.textContent = "No products to show yet.";
            container.appendChild(msg);
            return;
        }

        products.forEach((product, index) => {
            const card = createProductCardWithRemove(product, index, storageKey);
            container.appendChild(card);
        });

        addDeleteAllButton(sectionId, storageKey);
    }

    // Add or update the 'Delete All' button in the wrapper
    function addDeleteAllButton(sectionId, storageKey) {
        const wrapper = document.querySelector(`#${sectionId} .profile-grid-wrapper`);
        if (!wrapper) return;

        const existingBtn = wrapper.querySelector(".delete-all-btn");
        if (existingBtn) existingBtn.remove();

        const btn = document.createElement("button");
        btn.className = "delete-all-btn";
        btn.textContent = "Delete All";

        btn.addEventListener("click", async () => {
            if (!confirm("Are you sure you want to delete all products in this section?")) return;

            const products = JSON.parse(localStorage.getItem(storageKey)) || [];

            for (const product of products) {
                if (product.id) await deleteProductFromBackend(product.id);
            }

            localStorage.removeItem(storageKey);
            loadProfileSectionWithDelete(storageKey);
        });

        wrapper.appendChild(btn);
    }

    // Initialize sections
    loadProfileSectionWithDelete("newProducts");     // My Listings
    loadProfileSectionWithDelete("orderHistory");   // Order History
    loadProfileSectionWithDelete("savedFavorites"); // Favorites

});
