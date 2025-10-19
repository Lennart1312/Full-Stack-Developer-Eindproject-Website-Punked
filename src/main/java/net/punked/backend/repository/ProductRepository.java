package net.punked.backend.repository;

import net.punked.backend.model.Product;
import net.punked.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByGenre(String genre);

    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<Product> findBySeller(String seller);

    // ✅ New method for entity-based lookup
    List<Product> findBySeller(User seller);
}
