const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/process-payment", (req, res) => {
    const { delivery, payment, order } = req.body;

    if (!delivery || !payment || !order) {
        return res.status(400).json({ success: false, error: "Missing data" });
    }

    console.log("✅ Payment request received:");
    console.log("📦 Delivery:", delivery);
    console.log("💳 Payment:", payment);
    console.log("🧾 Order:", order);

    const orderId = "ORDER" + Math.floor(Math.random() * 1000000);
    res.json({ success: true, orderId });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
