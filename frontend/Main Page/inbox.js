document.addEventListener("DOMContentLoaded", async () => {
    const messageList = document.getElementById("message-list");

    // Fetch messages from backend API
    async function fetchMessages() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:8080/api/messages", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch messages");

            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    function renderMessageEntry(message) {
        const entry = document.createElement("div");
        entry.className = "message-entry";

        // Message Info
        const infoDiv = document.createElement("div");
        infoDiv.className = "message-info";

        const avatar = document.createElement("img");
        avatar.className = "message-avatar";
        avatar.src = message.senderAvatar || "../Assets/BlackIcon.png";
        avatar.alt = "User Avatar";

        const textDiv = document.createElement("div");
        textDiv.className = "message-text";

        const sender = document.createElement("div");
        sender.className = "sender-name";
        sender.textContent = message.senderUsername;

        const product = document.createElement("div");
        product.className = "product-name";
        product.textContent = `Interested in: ${message.productName}`;

        textDiv.appendChild(sender);
        textDiv.appendChild(product);
        infoDiv.appendChild(avatar);
        infoDiv.appendChild(textDiv);

        // Actions
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "message-actions";

        const viewBtn = document.createElement("button");
        viewBtn.className = "view-button";
        viewBtn.textContent = "View";
        viewBtn.onclick = () => {
            localStorage.setItem("currentMessage", JSON.stringify(message));
            window.location.href = message.type === "seller-request" ? "Messages.html" : "MessageBuyer.html";
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-button";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = async () => {
            if (!confirm("Are you sure you want to delete this message?")) return;

            try {
                const token = localStorage.getItem("token");
                await fetch(`http://localhost:8080/api/messages/${message.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                entry.remove();
            } catch (err) {
                console.error(err);
            }
        };

        actionsDiv.appendChild(viewBtn);
        actionsDiv.appendChild(deleteBtn);
        entry.appendChild(infoDiv);
        entry.appendChild(actionsDiv);

        // Approved purchase
        if (message.status === "approved" && message.type === "purchase-request") {
            entry.style.backgroundColor = "#ffcccc";
            const buyBtn = document.createElement("button");
            buyBtn.className = "buy-button";
            buyBtn.textContent = "Buy Now";
            buyBtn.onclick = () => {
                localStorage.setItem("selectedProduct", JSON.stringify({ title: message.productName }));
                window.location.href = "Pay.html";
            };
            actionsDiv.appendChild(buyBtn);
        }

        messageList.appendChild(entry);
    }

    const messages = await fetchMessages();
    messages.forEach(renderMessageEntry);
});
