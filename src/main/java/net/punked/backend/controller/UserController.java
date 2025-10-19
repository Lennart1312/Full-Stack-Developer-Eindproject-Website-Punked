package net.punked.backend.controller;

import net.punked.backend.dto.PasswordChangeDto;
import net.punked.backend.dto.UserProfileDto;
import net.punked.backend.model.User;
import net.punked.backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ─── Get Current User ───
    @GetMapping("/me")
    public User getMyProfile(Authentication auth) {
        User user = userService.findByUsername(auth.getName());
        if (user == null) throw new RuntimeException("User not found");
        return user;
    }

    // ─── Update Profile Information ───
    @PutMapping("/update")
    public User updateProfile(Authentication auth, @RequestBody UserProfileDto dto) {
        User user = userService.findByUsername(auth.getName());
        if (user == null) throw new RuntimeException("User not found");

        // Convert DTO to User and update fields
        User updated = new User();
        updated.setUsername(dto.getUsername());
        updated.setFirstName(dto.getFirstName());
        updated.setLastName(dto.getLastName());
        updated.setBio(dto.getBio());
        updated.setCountry(dto.getCountry());
        updated.setPaymentDetails(dto.getPaymentDetails());
        updated.setAvatar(dto.getAvatar());

        return userService.updateProfile(user.getId(), updated);
    }

    // ─── Change Password ───
    @PutMapping("/password")
    public void changePassword(Authentication auth, @RequestBody PasswordChangeDto dto) {
        User user = userService.findByUsername(auth.getName());
        if (user == null) throw new RuntimeException("User not found");

        boolean success = userService.changePassword(user.getId(), dto.getOldPassword(), dto.getNewPassword());
        if (!success) {
            throw new RuntimeException("Old password is incorrect");
        }
    }

    // ─── Upload Avatar ───
    @PostMapping("/avatar")
    public User uploadAvatar(Authentication auth, @RequestParam("avatar") MultipartFile file) throws IOException {
        User user = userService.findByUsername(auth.getName());
        if (user == null) throw new RuntimeException("User not found");

        // Convert uploaded image to Base64
        String base64 = java.util.Base64.getEncoder().encodeToString(file.getBytes());
        return userService.updateAvatar(user.getId(), base64);
    }

    // ─── Delete Account ───
    @DeleteMapping("/delete")
    public void deleteAccount(Authentication auth) {
        User user = userService.findByUsername(auth.getName());
        if (user == null) throw new RuntimeException("User not found");

        userService.deleteUser(user.getId());
    }
}
