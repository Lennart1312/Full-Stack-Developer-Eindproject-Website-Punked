async function loadProfileData() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.warn("User not logged in — using localStorage fallback.");
        // Optionally load from localStorage:
        const localProfile = JSON.parse(localStorage.getItem("profileData"));
        if (localProfile) {
            updateProfileUI(localProfile);
            renderSection('listings', localProfile.listings);
            renderSection('favorites', localProfile.favorites);
        }
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/api/profile", {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: "include"
        });

        if (!res.ok) throw new Error("Failed to fetch profile data.");
        const data = await res.json();

        updateProfileUI(data);
        renderSection('listings', data.listings);
        renderSection('favorites', data.favorites);
    } catch (err) {
        console.error("Error loading profile:", err);
    }
}

function updateProfileUI(data) {
    document.querySelectorAll('.avatar, .dropdown-avatar, .profile-icon').forEach(el => {
        el.src = data.avatarUrl || '../Assets/StandardIcon.png';
    });
    document.querySelectorAll('.username, .dropdown-username').forEach(el => {
        el.textContent = data.username || '@user';
    });
}

function renderSection(sectionId, products) {
    const container = document.querySelector(`#${sectionId} .profile-grid`);
    if (!container) return;
    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.innerHTML = "<p>No products to show yet.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = product.id || ""; // for future delete/update calls
        card.innerHTML = `
            <div class="image2-placeholder">
                <img src="${product.imageUrl || '../Assets/nothing.png'}" alt="${product.title}" />
            </div>
            <span class="genre-tag">${product.genre || 'Misc'}</span>
            <h4>${product.title}</h4>
            <p>€${product.price}</p>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", loadProfileData);
