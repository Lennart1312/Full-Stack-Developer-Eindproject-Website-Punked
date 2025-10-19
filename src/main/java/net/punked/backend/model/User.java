package net.punked.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users") // explicit table name for clarity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    // --- Extended Profile Fields ---
    private String firstName;
    private String lastName;
    private String bio;
    private String country;

    // Optional seller-related details
    private String paymentDetails;

    // Avatar image URL or base64 string (frontend uploads here)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String avatar;

    // --- Relationship with Product ---
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Product> products;

    // --- Convenience constructors ---
    public User(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // --- New method for inbox.js / MessageController ---
    public String getAvatarUrl() {
        // Return avatar if present, otherwise return a default placeholder
        return (avatar != null && !avatar.isEmpty()) ? avatar : "../Assets/BlackIcon.png";
    }
}
