document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".checkout-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to pay.");
            return;
        }

        // Collect delivery information
        const deliveryData = {
            fullName: form.querySelector('input[name="fullname"]').value,
            address: form.querySelector('textarea[name="address"]').value,
            phone: form.querySelector('input[name="phone"]').value || null
        };

        // Collect payment info
        const paymentMethod = form.querySelector('input[name="payment"]:checked').value;
        const bank = form.querySelector('select[name="bank"]')?.value || null;

        // Collect order items dynamically from the page
        const items = Array.from(document.querySelectorAll(".order-item")).map(li => ({
            name: li.querySelector("span:first-child").textContent,
            price: parseFloat(li.querySelector("span:last-child").textContent.replace("€", ""))
        }));

        const total = items.reduce((sum, item) => sum + item.price, 0);

        const payload = {
            delivery: deliveryData,
            payment: {
                method: paymentMethod,
                bank: bank
            },
            order: {
                items: items,
                total: total
            }
        };

        try {
            const res = await fetch("http://localhost:8080/api/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                alert(`✅ Payment successful! Order ID: ${result.orderId}`);
                form.reset();
                window.location.href = "Profile.html"; // or confirmation page
            } else {
                alert(`❌ Payment failed: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("🚨 An unexpected error occurred.");
        }
    });
});
