// send-message.js
document.addEventListener("DOMContentLoaded", () => {

    const messageForm = document.querySelector('.message-input-form');
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.querySelector('.message-input');

    if (!messageForm || !chatBox || !messageInput) return;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to send messages.");
        return;
    }

    // Determine page role: seller or buyer
    const isBuyerPage = window.location.pathname.includes("MessageBuyer.html");

    messageForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const msg = messageInput.value.trim();
        if (!msg) return;

        try {
            // Send message to backend
            const res = await fetch("http://localhost:8080/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: msg,
                    role: isBuyerPage ? "buyer" : "seller"
                })
            });

            if (!res.ok) throw new Error("Failed to send message");

            const sentMessage = await res.json();

            // Create message wrapper for frontend display
            const messageElement = document.createElement('div');
            messageElement.className = 'message ' + (isBuyerPage ? 'buyer' : 'seller');

            const messageText = document.createElement('div');
            messageText.className = 'message-text';
            messageText.textContent = sentMessage.content;

            const messageTime = document.createElement('div');
            messageTime.className = 'message-time';
            const now = new Date(sentMessage.timestamp || Date.now());
            messageTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            messageElement.appendChild(messageText);
            messageElement.appendChild(messageTime);

            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;

            messageInput.value = '';

        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message. Please try again.");
        }
    });

});
