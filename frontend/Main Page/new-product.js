// new-product.js
document.addEventListener("DOMContentLoaded", () => {
    const storedNewProducts = JSON.parse(localStorage.getItem("newProducts") || "[]");

    if (Array.isArray(storedNewProducts) && storedNewProducts.length > 0) {
        // Ensure each product has a saleType field for compatibility
        const updatedProducts = storedNewProducts.map(p => ({
            ...p,
            saleType: p.saleType || "approval" // default to approval if missing
        }));

        // Make sure `allProducts` exists before concatenating
        window.allProducts = window.allProducts || [];
        window.allProducts = updatedProducts.concat(window.allProducts);

        // Call renderResults if it exists
        if (typeof renderResults === "function") {
            renderResults();
        }
    }
});
