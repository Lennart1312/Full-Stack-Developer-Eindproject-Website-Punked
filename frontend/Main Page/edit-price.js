document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first.");
        window.location.href = "Login.html";
        return;
    }

    const productId = localStorage.getItem("selectedProductId");
    if (!productId) {
        document.querySelector(".product-layout").innerHTML = "<p style='color:red;'>Product not selected.</p>";
        return;
    }

    // Fetch product data from backend
    const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
        document.querySelector(".product-layout").innerHTML = "<p style='color:red;'>Product not found or access denied.</p>";
        return;
    }

    const product = await res.json();

    // Populate product info
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-genre").textContent = product.genre;
    document.getElementById("product-size").textContent = product.size || "N/A";
    document.getElementById("product-quality").textContent = product.condition || "Unknown";
    document.getElementById("product-category").textContent = product.category || "Unknown";
    document.getElementById("product-color").textContent = product.color || "N/A";
    document.getElementById("product-uploaded").textContent = product.uploaded ? new Date(product.uploaded).toLocaleDateString() : "N/A";
    document.getElementById("product-description").textContent = product.description || "";
    document.getElementById("price-input").value = parseFloat(product.price).toFixed(2);

    // Load main image & thumbnails
    const mainImg = document.getElementById("main-product-image");
    const thumbnails = document.getElementById("thumbnail-list");
    let currentIndex = 0;

    if (product.images && product.images.length > 0) {
        mainImg.src = product.images[0];
        product.images.forEach((src, idx) => {
            const thumb = document.createElement("img");
            thumb.src = src;
            thumb.classList.add("thumbnail");
            if (idx === 0) thumb.classList.add("active");
            thumb.addEventListener("click", () => {
                mainImg.src = src;
                thumbnails.querySelectorAll("img").forEach(i => i.classList.remove("active"));
                thumb.classList.add("active");
                currentIndex = idx;
            });
            thumbnails.appendChild(thumb);
        });
    } else {
        mainImg.src = "../Assets/no-image.png";
    }

    document.getElementById("prev-img").addEventListener("click", () => {
        if (!product.images || product.images.length === 0) return;
        currentIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        mainImg.src = product.images[currentIndex];
        thumbnails.querySelectorAll("img").forEach(i => i.classList.remove("active"));
        thumbnails.querySelectorAll("img")[currentIndex].classList.add("active");
    });

    document.getElementById("next-img").addEventListener("click", () => {
        if (!product.images || product.images.length === 0) return;
        currentIndex = (currentIndex + 1) % product.images.length;
        mainImg.src = product.images[currentIndex];
        thumbnails.querySelectorAll("img").forEach(i => i.classList.remove("active"));
        thumbnails.querySelectorAll("img")[currentIndex].classList.add("active");
    });

    // Update price
    document.getElementById("update-price-btn").addEventListener("click", async () => {
        const newPrice = parseFloat(document.getElementById("price-input").value);
        if (isNaN(newPrice) || newPrice < 0) {
            alert("Enter a valid price.");
            return;
        }

        const confirmChange = confirm(`Change price to €${newPrice.toFixed(2)}?`);
        if (!confirmChange) return;

        // Send PUT request to backend
        const updateRes = await fetch(`http://localhost:8080/api/products/${productId}/price`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ price: newPrice }) // matches ProductDto expected by backend
        });

        if (updateRes.ok) {
            alert("Price updated successfully.");
            location.reload();
        } else {
            const err = await updateRes.json();
            alert(err.message || "Failed to update price.");
        }
    });
});
