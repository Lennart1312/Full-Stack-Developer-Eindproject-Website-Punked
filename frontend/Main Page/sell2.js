// sell.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sell-form");
    const imageInput = document.getElementById("image-input");
    const imageCarousel = document.getElementById("image-carousel");
    const imageLimitWarning = document.getElementById("image-limit-warning");
    const submitBtn = form.querySelector('button[type="submit"]');
    const MAX_IMAGES = 3;

    let uploadedImages = [];

    // --- IMAGE UPLOAD ---
    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file || uploadedImages.length >= MAX_IMAGES) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImages.push(event.target.result);
            updateCarousel();
            updateSubmitButton();
        };
        reader.readAsDataURL(file);

        imageInput.value = "";
    });

    function updateCarousel() {
        imageCarousel.innerHTML = "";

        uploadedImages.forEach((imgSrc, index) => {
            const wrapper = document.createElement("div");
            wrapper.className = "image-wrapper";

            const img = document.createElement("img");
            img.src = imgSrc;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "✖";
            removeBtn.className = "remove-btn";
            removeBtn.onclick = () => {
                uploadedImages.splice(index, 1);
                updateCarousel();
                updateSubmitButton();
            };

            wrapper.appendChild(img);
            wrapper.appendChild(removeBtn);
            imageCarousel.appendChild(wrapper);
        });

        imageInput.disabled = uploadedImages.length >= MAX_IMAGES;
        imageLimitWarning.style.display = uploadedImages.length >= MAX_IMAGES ? "block" : "none";
    }

    function updateSubmitButton() {
        const requiredFields = ["title", "description", "genre", "category", "condition", "size", "price"];
        const allFilled = requiredFields.every(id => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== "";
        });
        submitBtn.disabled = uploadedImages.length === 0 || !allFilled;
    }

    form.addEventListener("input", updateSubmitButton);

    // --- FORM SUBMISSION ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const isLoggedIn = !!token;

        if (!isLoggedIn) {
            // Open the login modal from login-state.js
            const loginModal = document.getElementById("login-popup-overlay");
            if (loginModal) {
                loginModal.style.display = "flex";
                const emailInput = loginModal.querySelector("#login-email");
                emailInput?.focus();
                document.body.classList.add("modal-open"); // Prevent scroll behind modal
            }
            return;
        }

        const formData = new FormData(form);
        const cleanedGenre = (formData.get("genre") || "").replace(/\s*\(.*?\)\s*/g, "");

        let sellerUsername = "Anonymous";
        const loggedInUserStr = localStorage.getItem("loggedInUser");
        if (loggedInUserStr) {
            try {
                const userObj = JSON.parse(loggedInUserStr);
                sellerUsername = userObj.username || loggedInUserStr;
            } catch {
                sellerUsername = loggedInUserStr;
            }
        }

        const requiresApproval = formData.get("approval") === "yes";

        const newProduct = {
            title: formData.get("title") || "Untitled",
            price: parseFloat(formData.get("price") || "0"),
            genre: cleanedGenre,
            condition: formData.get("condition"),
            size: formData.get("size"),
            description: formData.get("description") || "",
            seller: sellerUsername,
            uploaded: new Date().toISOString(),
            color: formData.get("color"),
            category: formData.get("category"),
            image: uploadedImages[0] || "../Assets/placeholder.png",
            images: uploadedImages,
            saleType: requiresApproval ? "approval" : "instant"
        };

        const existing = JSON.parse(localStorage.getItem("newProducts") || "[]");
        existing.push(newProduct);
        localStorage.setItem("newProducts", JSON.stringify(existing));

        form.reset();
        uploadedImages = [];
        updateCarousel();
        updateSubmitButton();

        const successPopup = document.getElementById("success-popup");
        successPopup.style.display = "flex";

        setTimeout(() => {
            window.location.href = "Profile.html";
        }, 3000);
    });

    // --- ESC TO CLOSE MODALS ---
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const loginModal = document.getElementById("login-popup-overlay");
            if (loginModal && loginModal.style.display === "flex") {
                loginModal.style.display = "none";
                document.body.classList.remove("modal-open");
            }

            const successPopup = document.getElementById("success-popup");
            if (successPopup && successPopup.style.display === "flex") {
                successPopup.style.display = "none";
            }
        }
    });
});
