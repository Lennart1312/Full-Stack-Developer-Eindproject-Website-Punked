// profile.js

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    let user = null;

    if (token) {
        try {
            const res = await fetch("http://localhost:8080/api/users/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("Failed to fetch user profile");
            user = await res.json();
        } catch (err) {
            console.warn("Backend fetch failed, falling back to localStorage:", err);
            user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        }
    } else {
        // No token: fallback to localStorage
        user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    }

    // Display username
    const welcomeEl = document.getElementById("welcome-user");
    if (welcomeEl) {
        const username = user.username || "Guest";
        welcomeEl.textContent = `Welcome, ${username}!`;
    }

    // Fill other profile info if fields exist
    if (user.email) {
        const emailEl = document.getElementById("profile-email");
        if (emailEl) emailEl.textContent = user.email;
    }

    if (user.fullName) {
        const nameEl = document.getElementById("profile-fullname");
        if (nameEl) nameEl.textContent = user.fullName;
    }

    // --------------------
    // Tab switching
    // --------------------
    document.querySelectorAll(".tab-link").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = btn.dataset.tab;
            document.querySelectorAll(".tab-content").forEach(tab => {
                tab.style.display = "none";
            });
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) selectedTab.style.display = "block";
        });
    });

    // --------------------
    // Logout logic
    // --------------------
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("profileData"); // optional
            alert("You have been logged out.");
            window.location.href = "Main%20Page%20Text.html";
        });
    }
});
