// ======================
// Cart Management
// ======================

let cartItems = []; // start empty; will be loaded from backend
const cartPopup = document.getElementById('cart-popup');
const cartList = document.getElementById('cart-items-list');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');

const token = localStorage.getItem('token'); // JWT from login/signup
const API_BASE = 'http://localhost:8080/api'; // ✅ backend base URL

// ======================
// Backend API Helpers
// ======================

async function loadCartFromBackend() {
    if (!token) return; // user not logged in

    try {
        const res = await fetch(`${API_BASE}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        cartItems = data.items || [];
        renderCart();
        updateCartCount();
    } catch (err) {
        console.error('❌ Failed to load cart from backend:', err);
    }
}

async function saveCartToBackend() {
    if (!token) return; // user not logged in

    try {
        const res = await fetch(`${API_BASE}/cart/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cartItems)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
        console.error('❌ Failed to save cart to backend:', err);
    }
}

// ======================
// Cart Functions
// ======================

function openCart() {
    cartPopup.classList.toggle('hidden');
    renderCart();
}

function addToCart(name, price) {
    const exists = cartItems.find(item => item.name === name);
    if (exists) {
        alert(`"${name}" is already in your cart.`);
        return;
    }

    cartItems.push({ name, price: parseFloat(price), qty: 1 });
    renderCart();
    updateCartCount();
    saveCartToBackend();
}

function removeItem(index) {
    cartItems.splice(index, 1);
    renderCart();
    updateCartCount();
    saveCartToBackend();
}

function clearCart() {
    cartItems = [];
    renderCart();
    updateCartCount();
    cartPopup.classList.add('hidden');
    saveCartToBackend();
}

function renderCart() {
    cartList.innerHTML = '';
    let total = 0;

    cartItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} x${item.qty}</span>
            <span>€${(item.price * item.qty).toFixed(2)} 
                <button onclick="removeItem(${index})">✖</button>
            </span>
        `;
        cartList.appendChild(li);
        total += item.price * item.qty;
    });

    cartTotal.textContent = `Total: €${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cartItems.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = count;
}

// ======================
// Local Backup Helpers
// ======================

function saveCartBackup() {
    if (cartItems.length === 0) {
        alert('Cannot save an empty cart.');
        return;
    }
    localStorage.setItem('savedCart', JSON.stringify(cartItems));
    alert('Cart saved locally!');
}

function loadSavedCart() {
    const savedCart = JSON.parse(localStorage.getItem('savedCart') || '[]');
    if (savedCart.length > 0) {
        cartItems = savedCart;
        renderCart();
        updateCartCount();
    } else {
        alert('No saved cart found.');
    }
}

// ======================
// Init on Page Load
// ======================

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
    loadCartFromBackend(); // sync from backend on load
});

// ======================
// Expose globally
// ======================

window.addToCart = addToCart;
window.clearCart = clearCart;
window.openCart = openCart;
window.removeItem = removeItem;
window.saveCartBackup = saveCartBackup;
window.loadSavedCart = loadSavedCart;
