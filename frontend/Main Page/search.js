document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-input');
    const productGrid = document.querySelector('.product-grid'); // container for results

    searchForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        const token = localStorage.getItem('token');

        if (!query) return;

        try {
            // Fetch from backend API with Bearer token
            const res = await fetch(`http://localhost:8080/api/products?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to fetch products');

            const products = await res.json();
            productGrid.innerHTML = ''; // clear current products

            if (!products || products.length === 0) {
                window.location.href = 'No Results.html';
                return;
            }

            // Render products dynamically
            products.forEach(prod => {
                const div = document.createElement('div');
                div.classList.add('product-card');
                div.innerHTML = `
                    <div class="click-to-view">
                        <img src="${prod.imageUrl || '../Assets/Placeholder.png'}" alt="${prod.title}">
                    </div>
                    <h3>${prod.title}</h3>
                    <p>${prod.description}</p>
                    <span>€${prod.price.toFixed(2)}</span>
                `;

                div.querySelector('.click-to-view').addEventListener('click', () => {
                    localStorage.setItem("selectedProductId", prod.id);
                    window.location.href = 'Product.html';
                });

                productGrid.appendChild(div);
            });
        } catch (err) {
            console.error("Error fetching products:", err);
            productGrid.innerHTML = '<p style="color:red;">Failed to load search results. Please try again later.</p>';
        }
    });
});
