let allProducts = [];
let currentPage = 1;
const itemsPerPage = 20;

const resultsGrid = document.getElementById('results-grid');
const pagination = document.getElementById('pagination');
const selectedFiltersDiv = document.getElementById('selected-filters');

// --- Fetch products from backend + local fallback ---
async function loadProducts() {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            const res = await fetch("http://localhost:8080/api/products", {
                headers: { 'Authorization': `Bearer ${token}` }
            });


            if (res.ok) {
                allProducts = await res.json();
            } else {
                console.warn("Backend returned error, falling back to local products");
                allProducts = [];
            }
        } else {
            console.warn("No token found, using localStorage products only");
            allProducts = [];
        }
    } catch (err) {
        console.error("Error fetching products from backend:", err);
        allProducts = [];
    }

    // Add localStorage products
    const localProducts = JSON.parse(localStorage.getItem("newProducts") || "[]");
    allProducts.push(...localProducts);

    renderResults();
}

// --- The rest of your functions stay mostly the same ---
function getFilters() {
    return {
        genre: document.getElementById('filter-genre').value,
        condition: document.getElementById('filter-condition').value,
        size: document.getElementById('filter-size').value,
        color: document.getElementById('filter-color').value,
        sort: document.getElementById('filter-sort').value,
        category: document.getElementById('filter-category').value,
        priceMin: parseFloat(document.getElementById('price-min').value) || 0,
        priceMax: parseFloat(document.getElementById('price-max').value) || 9999
    };
}

// Keep applyFilters(), renderResults(), renderPagination(), updateSelectedFilters() the same

// Event listeners
document.querySelectorAll(".filter-toggle").forEach(toggle => {
    toggle.addEventListener("click", function () {
        const parent = this.closest(".filter-dropdown");
        parent.classList.toggle("show");
        document.querySelectorAll(".filter-dropdown").forEach(drop => {
            if (drop !== parent) drop.classList.remove("show");
        });
    });
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".filter-dropdown")) {
        document.querySelectorAll(".filter-dropdown").forEach(drop => drop.classList.remove("show"));
    }
});

document.getElementById('clear-filters').addEventListener('click', () => {
    document.querySelectorAll('.filter-select').forEach(select => select.selectedIndex = 0);
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    selectedFiltersDiv.innerHTML = '';
    document.querySelectorAll('.filter-dropdown').forEach(drop => drop.classList.remove('show'));
    currentPage = 1;
    renderResults();
});

['filter-genre','filter-condition','filter-color','filter-size','filter-sort','filter-category','price-min','price-max']
    .forEach(id => document.getElementById(id).addEventListener('change', renderResults));

loadProducts();
