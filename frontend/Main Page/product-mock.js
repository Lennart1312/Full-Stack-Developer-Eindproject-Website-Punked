// product.js

document.addEventListener("DOMContentLoaded", async () => {
    let product = null;

    // Try to get product ID (if the user came from a backend-linked page)
    const productId = localStorage.getItem("selectedProductId");

    if (productId) {
        try {
            const res = await fetch(`http://localhost:8080/api/products/${productId}`);
            if (!res.ok) throw new Error("Failed to fetch product details");
            product = await res.json();
        } catch (err) {
            console.warn("Backend fetch failed, falling back to localStorage:", err);
        }
    }

    // Fallback to localStorage version if backend not available
    if (!product) {
        product = JSON.parse(localStorage.getItem("selectedProduct"));
    }

    if (!product) {
        document.querySelector(".product-layout").innerHTML =
            "<p style='color:red;'>Product not found.</p>";
        return;
    }

    // ✅ Now populate the UI with product data
    document.getElementById("product-title").textContent = product.title || "Untitled";
    document.getElementById("product-genre").textContent = product.genre || "Genre Unknown";
    document.getElementById("product-price").textContent =
        product.price ? `€${parseFloat(product.price).toFixed(2)}` : "€0.00";
    document.getElementById("product-description").textContent =
        product.description || "No description available.";
    document.getElementById("product-quality").textContent = formatQuality(product.condition);
    document.getElementById("product-size").textContent = product.size || "N/A";
    document.getElementById("product-category").textContent = formatCategory(product.category);
    document.getElementById("product-color").textContent = product.color || "N/A";
    document.getElementById("product-uploaded").textContent = formatUploadedTime(product.uploaded);

    // Show whether instant or approval
    const purchaseLabel = document.getElementById("purchase-type");
    if (purchaseLabel) {
        if (product.saleType === "instant") {
            purchaseLabel.textContent = "✅ Instant Buy Available";
            purchaseLabel.style.color = "green";
        } else {
            purchaseLabel.textContent = "⚠️ Seller Approval Required";
            purchaseLabel.style.color = "orange";
        }
    }

    // Seller username logic
    let sellerName = "Unknown";
    if (product.seller) {
        if (typeof product.seller === "string") sellerName = product.seller;
        else if (typeof product.seller === "object" && product.seller.username)
            sellerName = product.seller.username;
    }
    document.getElementById("product-seller").textContent = sellerName;

    // Image carousel logic
    const thumbnails = document.getElementById("thumbnail-list");
    const mainImg = document.getElementById("main-product-image");
    let currentIndex = 0;

    if (product.images && product.images.length > 0) {
        mainImg.src = product.images[0];
        product.images.forEach((imgSrc, index) => {
            const thumb = document.createElement("img");
            thumb.src = imgSrc;
            thumb.alt = "Product thumbnail";
            thumb.classList.add("thumbnail");
            if (index === 0) thumb.classList.add("active");
            thumb.addEventListener("click", () => {
                mainImg.src = imgSrc;
                thumbnails.querySelectorAll("img").forEach(el => el.classList.remove("active"));
                thumb.classList.add("active");
                currentIndex = index;
            });
            thumbnails.appendChild(thumb);
        });
    } else {
        mainImg.src = "../Assets/no-image.png";
    }

    document.getElementById("prev-img").addEventListener("click", () => {
        if (!product.images || product.images.length === 0) return;
        currentIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        updateMainImage(currentIndex);
    });

    document.getElementById("next-img").addEventListener("click", () => {
        if (!product.images || product.images.length === 0) return;
        currentIndex = (currentIndex + 1) % product.images.length;
        updateMainImage(currentIndex);
    });

    function updateMainImage(index) {
        mainImg.src = product.images[index];
        thumbnails.querySelectorAll("img").forEach(el => el.classList.remove("active"));
        thumbnails.querySelectorAll("img")[index].classList.add("active");
    }

    // Load other products from the same seller
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    const sellerItemsContainer = document.getElementById("seller-other-items");
    const sameSellerProducts = allProducts.filter(
        p => p.seller === product.seller && p.title !== product.title
    );

    if (sameSellerProducts.length === 0) {
        document.getElementById("no-results").style.display = "block";
    } else {
        sameSellerProducts.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";

            const imageSrc = item.images?.[0] || "../Assets/no-image.png";

            card.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${imageSrc}" alt="${item.title}" class="product-thumb">
                </div>
                <div class="product-info-block">
                    <h4 class="product-name">${item.title}</h4>
                    <p class="product-price">€${parseFloat(item.price).toFixed(2)}</p>
                    <button class="view-button">View Product</button>
                </div>
            `;

            card.addEventListener("click", () => {
                localStorage.setItem("selectedProductId", item.id || null); // for backend
                localStorage.setItem("selectedProduct", JSON.stringify(item));
                window.location.href = "Product.html";
            });

            sellerItemsContainer.appendChild(card);
        });
    }
});

// --------------------
// Helper functions
// --------------------

function formatQuality(q) {
    switch (q) {
        case "green":
        case "good":
            return "Good";
        case "orange":
        case "slightly":
            return "Slightly Damaged";
        case "red":
        case "damaged":
            return "Damaged";
        default:
            return q || "Unknown";
    }
}

function formatCategory(c) {
    switch (c) {
        case "tshirts":
            return "T-Shirt";
        case "hoodies":
            return "Hoodie";
        case "pants":
            return "Pants";
        case "shoes":
            return "Shoes";
        case "posters":
            return "Poster";
        case "vinyl":
            return "Vinyl";
        case "accessories":
            return "Accessory";
        case "tour-specials":
            return "Tour Exclusive";
        case "special-items":
            return "Special Item";
        default:
            return c || "Unknown";
    }
}

function formatUploadedTime(uploadedDateStr) {
    if (!uploadedDateStr) return "Unknown";

    const now = new Date();
    const uploadedDate = new Date(uploadedDateStr);

    if (isNaN(uploadedDate)) return "Unknown";

    const diffMs = now - uploadedDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffYears = Math.floor(diffDays / 365);

    if (diffHours < 24) return "Today";
    if (diffDays < 7) return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    if (diffWeeks < 52) return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}

// --------------------
// Buy Now logic (instant or approval)
// --------------------
document.addEventListener("DOMContentLoaded", () => {
    const buyBtn = document.querySelector(".buy-button");
    if (!buyBtn) return;

    buyBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("profileData"));
        const product = JSON.parse(localStorage.getItem("selectedProduct"));

        if (!currentUser) {
            alert("Please log in before purchasing an item.");

            // 🧠 Remember the product the user tried to buy
            localStorage.setItem("redirectAfterLogin", window.location.href);

            // Redirect to login
            window.location.href = "Sign Up.html";
            return;
        }

        // 🧠 saleType can be 'instant' or 'approval' (set by seller when listing item)
        const saleType = product.saleType || "approval"; // default to approval

        if (saleType === "instant") {
            // ✅ Immediate checkout
            alert("This item is available for instant purchase!");
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "Pay.html";
        } else {
            // ⚠️ Seller requires chat/approval
            alert("This seller requires approval before purchase.\nA message request has been created for them.");

            // Optional: Add pending request to seller’s inbox (can integrate later)
            const pendingRequests = JSON.parse(localStorage.getItem("pendingRequests")) || [];
            pendingRequests.push({
                buyer: currentUser.username || currentUser.name || "Unknown Buyer",
                seller: product.seller,
                productTitle: product.title,
                price: product.price,
                timestamp: new Date().toISOString(),
                status: "pending"
            });
            localStorage.setItem("pendingRequests", JSON.stringify(pendingRequests));

            window.location.href = "Messages.html";
        }
    });
});

// --------------------
// Message Seller / Make an Offer logic
// --------------------
document.addEventListener("DOMContentLoaded", () => {
    const messageBtn = document.querySelector(".message-seller-button");
    const offerBtn = document.querySelector(".make-offer-button");

    [messageBtn, offerBtn].forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            const currentUser = JSON.parse(localStorage.getItem("profileData"));
            const product = JSON.parse(localStorage.getItem("selectedProduct"));

            if (!currentUser) {
                alert("Please log in to contact the seller.");

                // Remember the product page to redirect back after login
                localStorage.setItem("redirectAfterLogin", window.location.href);

                // Redirect to login page
                window.location.href = "Sign Up.html";
                return;
            }

            // Proceed to messaging or offer page
            if (btn === messageBtn) {
                window.location.href = "Messages.html";
            } else if (btn === offerBtn) {
                window.location.href = "Messages.html"; // or whichever page handles offers
            }
        });
    });
});
