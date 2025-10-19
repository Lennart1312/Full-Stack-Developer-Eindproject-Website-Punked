package net.punked.backend.dto;

public class AuthResponseDto {
    private String token;
    private String username;
    private String email;

    // --- No-args constructor ---
    public AuthResponseDto() {}

    // --- All-args constructor ---
    public AuthResponseDto(String token, String username, String email) {
        this.token = token;
        this.username = username;
        this.email = email;
    }

    // --- Getters & Setters ---
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}
