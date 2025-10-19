document.addEventListener("DOMContentLoaded", async () => {
    const nav = document.querySelector(".nav");
    const loginLink = [...nav.querySelectorAll("a")].find(link =>
        ["login", "logout"].includes(link.textContent.trim().toLowerCase())
    );
    const signupLink = [...nav.querySelectorAll("a")].find(link =>
        link.textContent.trim().toLowerCase().includes("sign up")
    );

    const profileIconContainer = document.querySelector(".profile-icon-container");
    const dropdownUsername = document.querySelector(".dropdown-username");

    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const isLoggedIn = !!token;

    // Redirect restricted pages if not logged in
    const restrictedPages = ["Profile.html", "Account Settings.html"];
    if (!isLoggedIn && restrictedPages.some(path => window.location.href.includes(path))) {
        alert("You must be logged in to access this page.");
        window.location.href = "Main%20Page%20Text.html";
        return;
    }

    if (isLoggedIn) {
        // ✅ Logged in UI setup
        if (loginLink) loginLink.textContent = "Logout";
        if (signupLink) signupLink.style.display = "none";
        if (profileIconContainer) profileIconContainer.style.display = "flex";

        if (dropdownUsername && loggedInUser.username) {
            dropdownUsername.textContent = "@" + loggedInUser.username;
        }

        // Inject profile icon if missing
        if (!document.getElementById("profile-menu-container")) {
            const cartContainer = document.querySelector(".cart-icon-container");
            const username = loggedInUser.username || "user";
            const profileHTML = `
                <div class="profile-icon-container" id="profile-menu-container">
                    <img src="../Assets/StandardIcon.png" alt="Profile" class="profile-icon" id="profile-icon">
                    <div class="profile-dropdown hidden" id="profile-dropdown">
                        <div class="profile-dropdown-header">
                            <img src="../Assets/StandardIcon.png" class="dropdown-avatar" alt="Avatar" />
                            <div class="dropdown-username">@${username}</div>
                        </div>
                        <ul>
                            <li><a href="Account%20Settings.html">Account Settings</a></li>
                            <li><a href="Profile.html">Order History</a></li>
                            <li><a href="Profile.html">My Listings</a></li>
                            <li><a href="Profile.html">Favorites</a></li>
                            <li><a href="Sell.html">Sell Merch</a></li>
                        </ul>
                    </div>
                </div>`;
            cartContainer?.insertAdjacentHTML("afterend", profileHTML);
        }

        // Attach dropdown script if needed
        if (!document.getElementById("profile-dropdown-script")) {
            const script = document.createElement("script");
            script.src = "profile-dropdown.js";
            script.id = "profile-dropdown-script";
            script.defer = true;
            document.body.appendChild(script);
        }

        // Logout
        loginLink?.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUser");
            alert("You have been logged out.");
            window.location.href = "Main%20Page%20Text.html";
        });

        // Load user's backend cart
        try {
            const res = await fetch("/api/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                window.cartItems = data.items || [];
            }
        } catch (err) {
            console.warn("Cart fetch failed (offline mode):", err);
        }

    } else {
        // 🚫 Logged out state
        if (profileIconContainer) profileIconContainer.style.display = "none";
        if (loginLink) loginLink.textContent = "Login";
        if (signupLink) signupLink.style.display = "inline-block";

        // Inject login popup
        const loginModalHTML = `
        <div class="loginw-popup-overlay" id="loginw-popup-overlay">
            <div class="loginw-popup">
                <h2>Login</h2>
                <form id="loginw-form">
                    <label for="loginw-email">Email:</label>
                    <input type="email" id="loginw-email" required>

                    <label for="loginw-password">Password:</label>
                    <input type="password" id="loginw-password" required>

                    <div class="loginw-popup-buttons">
                        <button type="submit">Login</button>
                        <button type="button" id="loginw-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", loginModalHTML);

        const loginOverlay = document.getElementById("loginw-popup-overlay");
        const cancelBtn = document.getElementById("loginw-cancel");
        const loginForm = document.getElementById("loginw-form");

        // Open popup
        loginLink?.addEventListener("click", (e) => {
            e.preventDefault();
            loginOverlay.style.display = "flex";
            document.body.classList.add("modal-open"); // Prevents page from scrolling
        });

        // Close popup
        cancelBtn.addEventListener("click", () => {
            loginOverlay.style.display = "none";
            document.body.classList.remove("modal-open"); // Restores normal page scroll
        });

        // Backend login
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginw-email").value.trim().toLowerCase();
            const password = document.getElementById("loginw-password").value;

            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) return alert("Invalid email or password.");
                const data = await res.json();

                localStorage.setItem("token", data.token);
                localStorage.setItem("loggedInUser", JSON.stringify({
                    username: data.username,
                    email
                }));

                loginOverlay.style.display = "none";
                location.reload();
            } catch (err) {
                console.error(err);
                alert("Login failed. Please try again.");
            }
        });
    }
});
