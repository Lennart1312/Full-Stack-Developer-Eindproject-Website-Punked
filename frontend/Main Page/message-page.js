// message-page.js
document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.querySelector('.message-input-form');
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.querySelector('.message-input');

    if (!messageForm || !chatBox || !messageInput) return;

    const isBuyerPage = window.location.pathname.includes("MessageBuyer.html");
    let currentMessage = JSON.parse(localStorage.getItem('currentMessage')) || {};
    const token = localStorage.getItem('token');

    const confirmButton = document.querySelector('.confirm-sale-btn');
    if (confirmButton) {
        confirmButton.textContent = isBuyerPage ? "Confirm Purchase" : "Confirm Sale";
        confirmButton.addEventListener('click', async () => {
            if (!token || !currentMessage.id) return;
            const confirmText = isBuyerPage
                ? "Are you sure you wish to confirm this purchase?"
                : "Are you sure you wish to confirm this sale?";
            if (!confirm(confirmText)) return;

            try {
                await fetch(`http://localhost:8080/api/messages/approve/${currentMessage.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert(isBuyerPage
                    ? "Purchase request confirmed! Seller will be notified."
                    : "Sale confirmed! The buyer will be notified.");
                currentMessage.status = "approved";
                localStorage.setItem('currentMessage', JSON.stringify(currentMessage));
            } catch (err) {
                console.error(err);
                alert("Failed to confirm action.");
            }
        });
    }

    async function loadMessages() {
        if (!token || !currentMessage.id) return;

        try {
            const res = await fetch(`http://localhost:8080/api/messages/thread/${currentMessage.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const messages = await res.json();

            chatBox.innerHTML = '';
            messages.forEach(msg => appendMessage(msg));
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    }

    function appendMessage(msg) {
        const messageElement = document.createElement('div');
        const senderMatchesCurrentUser = msg.senderId === currentMessage.currentUserId;
        messageElement.className = 'message ' + (senderMatchesCurrentUser
            ? (isBuyerPage ? 'buyer' : 'seller')
            : (isBuyerPage ? 'seller' : 'buyer'));

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = msg.content;

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.appendChild(messageText);
        messageElement.appendChild(messageTime);
        chatBox.appendChild(messageElement);
    }

    messageForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const msg = messageInput.value.trim();
        if (!msg || !token || !currentMessage.receiverId) return;

        try {
            const res = await fetch('http://localhost:8080/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: currentMessage.receiverId,
                    content: msg,
                    productName: currentMessage.product || "",
                    type: isBuyerPage ? "buyer-message" : "seller-message",
                    status: currentMessage.status || "pending"
                })
            });

            if (!res.ok) throw new Error("Failed to send message");
            const savedMsg = await res.json();
            appendMessage(savedMsg);
            chatBox.scrollTop = chatBox.scrollHeight;
            messageInput.value = '';
        } catch (err) {
            console.error(err);
            alert("Failed to send message");
        }
    });

    loadMessages();
});
