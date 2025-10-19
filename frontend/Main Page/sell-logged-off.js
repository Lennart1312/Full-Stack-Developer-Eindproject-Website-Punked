// sell-logged-off.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sell-form");
    if (!form) return;

    const submitBtn = form.querySelector("button[type='submit']");
    const token = localStorage.getItem("token");

    if (!token) {
        // Disable submit button since user is not logged in
        if (submitBtn) submitBtn.disabled = true;

        // Intercept form submission
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // stop actual submission

            // Show the login-required-popup overlay
            const loginPopup = document.getElementById("login-required-popup");
            if (loginPopup) {
                loginPopup.style.display = "flex";
            }
        });
    }
});
