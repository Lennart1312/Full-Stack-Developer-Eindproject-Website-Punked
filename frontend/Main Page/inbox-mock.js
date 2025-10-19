document.addEventListener("DOMContentLoaded", () => {
    const messageList = document.getElementById("message-list");

    // Load real messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

    // Add a test message for the approved purchase
    const testMessage = {
        username: "@testBuyer",
        product: `Test Product - "${randomBandShirt()}"`,
        avatar: "../Assets/BlackIcon.png",
        status: "approved",
        type: "purchase-request"
    };
    // Only add if not already in localStorage
    if (!storedMessages.some(m => m.username === testMessage.username && m.product === testMessage.product)) {
        storedMessages.unshift(testMessage); // add at the top
        localStorage.setItem("messages", JSON.stringify(storedMessages));
    }

    // Add mock messages for testing if empty
    if (storedMessages.length === 0) {
        const mockUsers = Array.from({ length: 10 }, (_, i) => ({
            username: `@buyer${100 + i}`,
            product: `Product #${i + 1} - "${randomBandShirt()}"`,
            avatar: "../Assets/BlackIcon.png",
            status: "pending",
            type: "purchase-request"
        }));
        storedMessages.push(...mockUsers);
        localStorage.setItem("messages", JSON.stringify(storedMessages));
    }

    // Function to render each message entry
    function renderMessageEntry(message) {
        const entry = document.createElement("div");
        entry.className = "message-entry";

        // Message Info
        const infoDiv = document.createElement("div");
        infoDiv.className = "message-info";

        const avatar = document.createElement("img");
        avatar.className = "message-avatar";
        avatar.src = message.avatar || "../Assets/BlackIcon.png";
        avatar.alt = "User Avatar";

        const textDiv = document.createElement("div");
        textDiv.className = "message-text";

        const sender = document.createElement("div");
        sender.className = "sender-name";
        sender.textContent = message.username;

        const product = document.createElement("div");
        product.className = "product-name";
        product.textContent = `Interested in: ${message.product}`;

        textDiv.appendChild(sender);
        textDiv.appendChild(product);
        infoDiv.appendChild(avatar);
        infoDiv.appendChild(textDiv);

        // Message Actions
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "message-actions";

        const viewBtn = document.createElement("button");
        viewBtn.className = "view-button";
        viewBtn.textContent = "View";

        viewBtn.onclick = () => {
            if (message.type === "seller-request") {
                window.location.href = "Messages.html";
            } else {
                window.location.href = "MessageBuyer.html";
            }
            localStorage.setItem("currentMessage", JSON.stringify(message));
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-button";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            if (confirm("Are you sure you want to delete this message request?")) {
                entry.remove();
                const allMessages = JSON.parse(localStorage.getItem("messages")) || [];
                const index = allMessages.findIndex(m => m.username === message.username && m.product === message.product);
                if (index !== -1) {
                    allMessages.splice(index, 1);
                    localStorage.setItem("messages", JSON.stringify(allMessages));
                }
            }
        };

        actionsDiv.appendChild(viewBtn);
        actionsDiv.appendChild(deleteBtn);

        entry.appendChild(infoDiv);
        entry.appendChild(actionsDiv);

        // If message is approved for purchase, mark red + add Buy button
        if (message.status === "approved" && message.type === "purchase-request") {
            entry.style.backgroundColor = "#ffcccc"; // light red
            const buyBtn = document.createElement("button");
            buyBtn.className = "buy-button";
            buyBtn.textContent = "Buy Now";
            buyBtn.onclick = () => {
                localStorage.setItem("selectedProduct", JSON.stringify({ title: message.product }));
                window.location.href = "Pay.html";
            };
            actionsDiv.appendChild(buyBtn);
        }

        messageList.appendChild(entry);
    }

    // Render all messages
    storedMessages.forEach(renderMessageEntry);
});

function randomBandShirt() {
    const shirts = [
        "Nirvana Tee", "Metallica Hoodie", "Arctic Monkeys Cap", "Queen Tank",
        "Slipknot Longsleeve", "The Strokes Zip-Up", "The Cure Tee",
        "Joy Division Shirt", "AC/DC Sweater", "Radiohead Tee", "Tool Hoodie",
        "Deftones Cap", "Foo Fighters Tee", "My Chemical Romance Shirt",
        "Green Day Hoodie", "Linkin Park Beanie", "Pearl Jam Tee",
        "Smashing Pumpkins Shirt", "The Killers Longsleeve", "Paramore Crop Top"
    ];
    return shirts[Math.floor(Math.random() * shirts.length)];
}
