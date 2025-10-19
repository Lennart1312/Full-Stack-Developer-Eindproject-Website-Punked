document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to access your profile settings.");
        window.location.href = "login.html";
        return;
    }

    const apiBase = "http://localhost:8080/api/user";

    // ─── Profile Display & Form Inputs ───
    const displayUsernameElements = document.querySelectorAll('.username, .dropdown-username');
    const inputs = {
        username: document.getElementById('username'),
        firstname: document.getElementById('firstName'),
        lastname: document.getElementById('lastName'),
        country: document.getElementById('country'),
        bio: document.getElementById('bio'),
        password: document.getElementById('password'),
    };

    const avatarPreview = document.getElementById('avatarPreview');
    const profileIcon = document.getElementById('profile-icon');
    const dropdownAvatar = document.querySelector('.dropdown-avatar');
    const profileImageInput = document.getElementById('profileImage');
    const cancelBtn = document.getElementById('cancelAccount');

    // ─── Load User Data ───
    fetch(`${apiBase}/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch user profile");
            return res.json();
        })
        .then(user => {
            inputs.username.value = user.username || "";
            inputs.firstname.value = user.firstName || "";
            inputs.lastname.value = user.lastName || "";
            inputs.country.value = user.country || "";
            inputs.bio.value = user.bio || "";
            displayUsernameElements.forEach(el => el.textContent = user.username);

            if (user.avatarUrl) {
                avatarPreview.src = user.avatarUrl;
                if (profileIcon) profileIcon.src = user.avatarUrl;
                if (dropdownAvatar) dropdownAvatar.src = user.avatarUrl;
            }

            // Save profile to localStorage for other pages
            localStorage.setItem("profileData", JSON.stringify(user));
        })
        .catch(err => console.error("Error loading profile:", err));

    // ─── Save Profile Changes on blur ───
    function saveProfileChanges() {
        const updatedUser = {
            username: inputs.username.value,
            firstName: inputs.firstname.value,
            lastName: inputs.lastname.value,
            country: inputs.country.value,
            bio: inputs.bio.value,
        };

        fetch(`${apiBase}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify(updatedUser),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update profile");
                displayUsernameElements.forEach(el => el.textContent = inputs.username.value);

                // Update localStorage
                const profileData = JSON.parse(localStorage.getItem("profileData")) || {};
                localStorage.setItem("profileData", JSON.stringify({ ...profileData, ...updatedUser }));
            })
            .catch(err => console.error("Profile update error:", err));
    }

    Object.entries(inputs).forEach(([key, input]) => {
        if (key === "password") return; // skip password
        input.addEventListener("blur", saveProfileChanges);
    });

    // ─── Password Change ───
    inputs.password.addEventListener("change", () => {
        const newPassword = inputs.password.value;
        if (!newPassword) return;

        fetch(`${apiBase}/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({ newPassword }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update password");
                alert("Password updated successfully!");
            })
            .catch(err => console.error("Password change failed:", err));
    });

    // ─── Avatar Upload ───
    if (profileImageInput) {
        profileImageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("avatar", file);

            fetch(`${apiBase}/avatar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
                body: formData,
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to upload avatar");
                    return res.json();
                })
                .then(data => {
                    const url = data.avatarUrl;
                    avatarPreview.src = url;
                    if (profileIcon) profileIcon.src = url;
                    if (dropdownAvatar) dropdownAvatar.src = url;

                    // Update localStorage
                    const profileData = JSON.parse(localStorage.getItem("profileData")) || {};
                    localStorage.setItem("profileData", JSON.stringify({ ...profileData, avatarUrl: url }));
                })
                .catch(err => console.error("Avatar upload error:", err));
        });
    }

    // ─── Cancel Account ───
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to cancel your account? This cannot be undone.")) {
                fetch(`${apiBase}/delete`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include"
                })
                    .then(res => {
                        if (!res.ok) throw new Error("Failed to delete account");
                        alert("Your account has been deleted.");
                        localStorage.clear();
                        window.location.href = "index.html";
                    })
                    .catch(err => console.error("Delete account failed:", err));
            }
        });
    }
});
