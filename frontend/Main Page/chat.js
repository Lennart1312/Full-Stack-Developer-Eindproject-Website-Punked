// chat.js
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "YOUR-ID",
    appId: "YOUR-APP-ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get DOM elements
const chatBox = document.getElementById("chat-box");
const form = document.querySelector(".message-input-form");
const input = document.querySelector(".message-input");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;

    await db.collection("messages").add({
        sender: "seller", // Or "buyer" depending on user session
        message: msg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    input.value = "";
});

// Listen for new messages
db.collection("messages").orderBy("timestamp").onSnapshot((snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${data.sender}`;
        msgDiv.textContent = data.message;
        chatBox.appendChild(msgDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
});
