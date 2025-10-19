package net.punked.backend.controller;

import net.punked.backend.dto.UserProfileDto;
import net.punked.backend.model.User;
import net.punked.backend.model.Product;
import net.punked.backend.model.Favorite;
import net.punked.backend.service.UserService;
import net.punked.backend.service.ProductService;
import net.punked.backend.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileController {

    @Autowired private UserService userService;
    @Autowired private ProductService productService;
    @Autowired private FavoriteService favoriteService;

    @GetMapping
    public UserProfileDto getProfile(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<Product> listings = productService.findBySeller(user);
        List<Favorite> favorites = favoriteService.findByUser(user);

        UserProfileDto dto = new UserProfileDto();
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setCountry(user.getCountry());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        dto.setListings(listings);
        dto.setFavorites(favorites);
        return dto;
    }
}
