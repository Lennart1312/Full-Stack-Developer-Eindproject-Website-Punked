// signup-logic.js - backend integrated for Sign Up2.html
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordMask = document.getElementById('password-mask');
    const confirmPasswordMask = document.getElementById('confirm-password-mask');

    function updateMask(input, mask) {
        mask.textContent = '●'.repeat(input.value.length);
    }

    passwordInput.addEventListener('input', () => updateMask(passwordInput, passwordMask));
    confirmPasswordInput.addEventListener('input', () => updateMask(confirmPasswordInput, confirmPasswordMask));
    updateMask(passwordInput, passwordMask);
    updateMask(confirmPasswordInput, confirmPasswordMask);

    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                toggle.src = '../Assets/see.png';
                toggle.alt = 'Hide Password';
            } else {
                input.type = 'password';
                toggle.src = '../Assets/unsee.png';
                toggle.alt = 'Show Password';
            }
        });
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const agree = document.getElementById('agree');

        if (!agree.checked) return alert('You must agree to the Terms and Privacy Policy.');
        if (!username || !password || !confirmPassword) return alert('Please fill in all fields.');
        if (password !== confirmPassword) return alert('Passwords do not match.');

        try {
            // Step 1: Register the user
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (!res.ok) {
                const err = await res.json();
                return alert(err.message || 'Registration failed.');
            }

            const data = await res.json();

            // Step 2: Auto-login the user
            const loginRes = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!loginRes.ok) return alert('Login after signup failed.');
            const loginData = await loginRes.json();

            localStorage.setItem('token', loginData.token);
            localStorage.setItem('loggedInUser', JSON.stringify({ username, email }));

            // Step 3: Sync backend cart
            window.cartItems = [];
            fetch('http://localhost:8080/api/cart', {
                headers: { 'Authorization': `Bearer ${loginData.token}` }
            })
                .then(r => r.json())
                .then(data => { window.cartItems = data.items || []; })
                .catch(err => console.warn('Failed to fetch cart:', err));

            // Step 4: Redirect
            window.location.href = 'Main Page Text.html';
        } catch (err) {
            console.error(err);
            alert('Something went wrong during registration.');
        }
    });
});
