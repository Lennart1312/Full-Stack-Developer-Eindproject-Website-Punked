document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav");
    const loginLink = [...nav.querySelectorAll("a")].find(link =>
        ["login", "logout"].includes(link.textContent.trim().toLowerCase())
    );
    const signupLink = [...nav.querySelectorAll("a")].find(link =>
        link.textContent.trim().toLowerCase() === "sign up"
    );

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const restrictedPages = ["Profile.html", "Account Settings.html"];
    if (!isLoggedIn && restrictedPages.some(path => window.location.href.includes(path))) {
        alert("You must be logged in to access this page.");
        window.location.href = "Main%20Page%20Text.html";
        return;
    }

    if (isLoggedIn) {
        // Update nav
        if (loginLink) loginLink.textContent = "Logout";
        if (signupLink) signupLink.style.display = "none";

        // Logout
        loginLink?.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUser");
            window.location.href = "Main%20Page%20Text.html";
        });

        // Inject profile icon
        if (!document.getElementById("profile-menu-container")) {
            const cartContainer = document.querySelector(".cart-icon-container");
            const username = JSON.parse(localStorage.getItem("loggedInUser"))?.username || "user";
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
            cartContainer.insertAdjacentHTML("afterend", profileHTML);
        }

        // Attach dropdown logic
        if (!document.getElementById("profile-dropdown-script")) {
            const script = document.createElement("script");
            script.src = "profile-dropdown.js";
            script.id = "profile-dropdown-script";
            script.defer = true;
            document.body.appendChild(script);
        }

    } else {
        // Show login UI
        if (loginLink) loginLink.textContent = "Login";
        if (signupLink) signupLink.style.display = "inline-block";

        const loginModalHTML = `
        <div class="login-popup-overlay" id="login-popup-overlay">
            <div class="login-popup">
                <h2>Login</h2>
                <form id="login-form">
                    <label for="login-email">Email:</label>
                    <input type="email" id="login-email" required>

                    <label for="login-password">Password:</label>
                    <input type="password" id="login-password" required>

                    <div class="popup-buttons">
                        <button type="submit">Login</button>
                        <button type="button" id="cancel-login">Cancel</button>
                    </div>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", loginModalHTML);

        const loginOverlay = document.getElementById("login-popup-overlay");
        const cancelBtn = document.getElementById("cancel-login");
        const loginForm = document.getElementById("login-form");

        // Open popup
        loginLink?.addEventListener("click", (e) => {
            e.preventDefault();
            loginOverlay.style.display = "flex";
        });

        // Close popup
        cancelBtn.addEventListener("click", () => {
            loginOverlay.style.display = "none";
        });

        // Login submit → BACKEND LOGIN
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim().toLowerCase();
            const password = document.getElementById("login-password").value;

            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) return alert("Invalid email or password.");
                const data = await res.json();

                localStorage.setItem("token", data.token);
                localStorage.setItem("loggedInUser", JSON.stringify({ username: data.username, email }));

                loginOverlay.style.display = "none";
                location.reload();
            } catch (err) {
                console.error(err);
                alert("Login failed. Please try again.");
            }
        });
    }
});
