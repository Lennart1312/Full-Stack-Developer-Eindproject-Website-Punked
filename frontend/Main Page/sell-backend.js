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
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            document.getElementById("login-required-popup").style.display = "flex";
            return;
        }

        const formData = new FormData(form);
        const requiresApproval = formData.get("approval") === "yes";

        const product = {
            title: formData.get("title"),
            price: parseFloat(formData.get("price")),
            genre: formData.get("genre"),
            category: formData.get("category"),
            condition: formData.get("condition"),
            size: formData.get("size"),
            description: formData.get("description"),
            color: formData.get("color"),
            images: uploadedImages,
            imageUrl: uploadedImages[0] || null,
            saleType: requiresApproval ? "approval" : "instant"
        };

        try {
            const res = await fetch("http://localhost:8080/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(product),
                credentials: "include"
            });

            if (!res.ok) throw new Error("Failed to list product");

            const createdProduct = await res.json();

            // Add to localStorage.newProducts for frontend rendering
            const existingProducts = JSON.parse(localStorage.getItem("newProducts") || "[]");
            existingProducts.push({
                ...createdProduct,
                saleType: product.saleType
            });
            localStorage.setItem("newProducts", JSON.stringify(existingProducts));

            const successPopup = document.getElementById("success-popup");
            successPopup.style.display = "flex";

            form.reset();
            uploadedImages = [];
            updateCarousel();
            updateSubmitButton();

            setTimeout(() => {
                window.location.href = "Profile.html";
            }, 2000);

        } catch (err) {
            alert("Error: " + err.message);
        }
    });

    // ESC to close popups
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const loginPopup = document.getElementById("login-required-popup");
            if (loginPopup.style.display === "flex") loginPopup.style.display = "none";

            const successPopup = document.getElementById("success-popup");
            if (successPopup.style.display === "flex") successPopup.style.display = "none";
        }
    });
});
