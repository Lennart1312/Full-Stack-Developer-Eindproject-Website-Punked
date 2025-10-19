package net.punked.backend.controller;

import net.punked.backend.dto.RegisterDto;
import net.punked.backend.dto.LoginDto;
import net.punked.backend.dto.AuthResponseDto;
import net.punked.backend.model.User;
import net.punked.backend.service.UserService;
import net.punked.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // allow frontend from any origin
public class AuthController {

    @Autowired private UserService userService;
    @Autowired private JwtUtil jwtUtil;

    // ---------------- Register ----------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto dto) {
        if (userService.findByEmail(dto.getEmail()) != null)
            return ResponseEntity.badRequest().body("{\"message\":\"Email already in use.\"}");
        if (userService.findByUsername(dto.getUsername()) != null)
            return ResponseEntity.badRequest().body("{\"message\":\"Username already taken.\"}");

        User user = userService.register(dto.getUsername(), dto.getEmail(), dto.getPassword());
        return ResponseEntity.ok(user);
    }

    // ---------------- Login ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        User user = userService.findByUsername(dto.getUsername());
        if (user == null) return ResponseEntity.badRequest().body("{\"message\":\"User not found.\"}");

        if (!userService.checkPassword(user, dto.getPassword()))
            return ResponseEntity.badRequest().body("{\"message\":\"Incorrect password.\"}");

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponseDto(token, user.getUsername(), user.getEmail()));
    }
}
