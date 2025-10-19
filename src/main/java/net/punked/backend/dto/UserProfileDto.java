package net.punked.backend.dto;

import lombok.Getter;
import lombok.Setter;
import net.punked.backend.model.Product;
import net.punked.backend.model.Favorite;

import java.util.List;

@Getter
@Setter
public class UserProfileDto {
    private String username;
    private String firstName;
    private String lastName;
    private String bio;
    private String country;
    private String paymentDetails;
    private String avatar; // base64 or image URL

    private List<Product> listings;
    private List<Favorite> favorites;
}
