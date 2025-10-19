document.addEventListener("DOMContentLoaded", async () => {
    const nav = document.querySelector(".nav");
    const loginLink = [...nav.querySelectorAll("a")].find(link =>
        ["login", "logout"].includes(link.textContent.trim().toLowerCase())
    );
    const signupLink = [...nav.querySelectorAll("a")].find(link =>
        link.textContent.trim().toLowerCase().includes("signup")
    );

    const profileIconContainer = document.querySelector(".profile-icon-container");
    const dropdownUsername = document.querySelector(".dropdown-username");
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const isLoggedIn = !!token;

    // Restrict certain pages when not logged in
    const restrictedPages = ["Profile.html", "Account Settings.html", "Sell.html"];
    if (!isLoggedIn && restrictedPages.some(path => window.location.href.includes(path))) {
        alert("You must be logged in to access this page.");
        window.location.href = "Main%20Page%20Text.html";
        return;
    }

    if (isLoggedIn) {
        // ✅ Logged-in state
        if (loginLink) loginLink.textContent = "Logout";
        if (signupLink) signupLink.style.display = "none";
        if (profileIconContainer) profileIconContainer.style.display = "flex";

        if (dropdownUsername && loggedInUser.username) {
            dropdownUsername.textContent = "@" + loggedInUser.username;
        }

        // Logout handler
        loginLink?.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUser");
            alert("You have been logged out.");
            window.location.href = "Main%20Page%20Text.html";
        });

        // Load cart from backend (if connected)
        try {
            const res = await fetch("/api/cart", {
                headers: { Authorization: token }
            });
            if (res.ok) {
                const data = await res.json();
                window.cartItems = data.items || [];
            }
        } catch (err) {
            console.warn("Cart fetch failed (offline mode):", err);
        }

    } else {
        // 🚫 Logged-out state
        if (profileIconContainer) profileIconContainer.style.display = "none";
        if (loginLink) loginLink.textContent = "Login";
        if (signupLink) signupLink.style.display = "inline-block";

        loginLink?.addEventListener("click", async (e) => {
            e.preventDefault();

            // 🔹 NEW — email prompt before username & password
            const email = prompt("Enter your email:");
            if (!email) return;

            const username = prompt("Enter your username:");
            if (!username) return;

            const password = prompt("Enter your password:");
            if (!password) return;

            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                });

                if (!res.ok) {
                    alert("Invalid credentials or account not found.");
                    return;
                }

                const data = await res.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("loggedInUser", JSON.stringify({ username, email }));
                alert(`Welcome back, ${username}!`);
                location.reload();
            } catch (err) {
                console.error(err);
                alert("Login failed. Please try again later.");
            }
        });
    }
});
