package net.punked.backend.controller;

import net.punked.backend.model.*;
import net.punked.backend.repository.*;
import net.punked.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    @Autowired private FavoriteRepository favRepo;
    @Autowired private UserService userService;
    @Autowired private ProductRepository productRepo;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggle(@RequestBody Map<String,Long> body, Principal principal) {
        Long productId = body.get("productId");
        if (principal == null) return ResponseEntity.status(401).build();
        User user = userService.findByUsername(principal.getName());
        Product product = productRepo.findById(productId).orElse(null);
        if (product == null) return ResponseEntity.notFound().build();

        Optional<Favorite> existing = favRepo.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            favRepo.delete(existing.get());
            return ResponseEntity.ok(Map.of("favorited", false));
        } else {
            favRepo.save(new Favorite(user, product));
            return ResponseEntity.ok(Map.of("favorited", true));
        }
    }

    @GetMapping
    public List<Favorite> myFavorites(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return favRepo.findByUser(user);
    }
}
