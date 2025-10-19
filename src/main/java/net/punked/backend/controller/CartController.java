package net.punked.backend.controller;

import net.punked.backend.dto.CartItemDto;
import net.punked.backend.model.User;
import net.punked.backend.repository.UserRepository;
import net.punked.backend.security.JwtUtil;
import net.punked.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    public CartController(CartService cartService, UserRepository userRepo, JwtUtil jwtUtil) {
        this.cartService = cartService;
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    private User getUserFromToken(String token) {
        if (token == null || token.isEmpty()) return null;
        if (token.startsWith("Bearer ")) token = token.substring(7);
        String username = jwtUtil.validateAndGetUsername(token);
        return userRepo.findByUsername(username).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getCart(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        if (user == null) return ResponseEntity.status(401).body("Invalid token");
        List<CartItemDto> items = cartService.getCart(user);
        return ResponseEntity.ok().body(java.util.Map.of("items", items));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveCart(
            @RequestHeader("Authorization") String token,
            @RequestBody List<CartItemDto> items
    ) {
        User user = getUserFromToken(token);
        if (user == null) return ResponseEntity.status(401).body("Invalid token");
        cartService.saveCart(user, items);
        return ResponseEntity.ok().body("Cart saved");
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        if (user == null) return ResponseEntity.status(401).body("Invalid token");
        cartService.clearCart(user);
        return ResponseEntity.ok().body("Cart cleared");
    }
}
