// js/auth-api.js
export async function loginUser(email, password) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        throw new Error("Invalid credentials");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("loggedInUser", JSON.stringify({
        username: data.username,
        email: email
    }));
    return data;
}

export async function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    window.location.href = "Main%20Page%20Text.html";
}

export function getLoggedInUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return !!localStorage.getItem("token");
}
