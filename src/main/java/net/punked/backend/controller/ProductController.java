package net.punked.backend.controller;

import net.punked.backend.dto.ProductDto;
import net.punked.backend.model.Product;
import net.punked.backend.model.User;
import net.punked.backend.service.ProductService;
import net.punked.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // allow frontend access
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    /**
     * List all products as ProductDto, optionally filtered by genre or search query.
     */
    @GetMapping
    public ResponseEntity<List<ProductDto>> listProducts(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String q,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        List<Product> products = productService.getAllProducts();

        // Filter by search query
        if (q != null && !q.isEmpty()) {
            products = products.stream()
                    .filter(p -> p.getTitle().toLowerCase().contains(q.toLowerCase())
                            || (p.getDescription() != null && p.getDescription().toLowerCase().contains(q.toLowerCase())))
                    .collect(Collectors.toList());
        }

        // Filter by genre
        if (genre != null && !genre.isEmpty()) {
            products = products.stream()
                    .filter(p -> genre.equalsIgnoreCase(p.getGenre()))
                    .collect(Collectors.toList());
        }

        // Map to DTO using service method
        List<ProductDto> dtos = products.stream()
                .map(productService::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * Get a single product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id,
                                                 @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(productService.toDto(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create a new product and assign seller from Authorization token
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product,
                                                 @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User seller = userService.getUserFromToken(token);

            if (seller == null) {
                return ResponseEntity.status(401).build();
            }

            product.setSeller(seller);
            Product saved = productService.saveProduct(product);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Update price of a product (owner only)
     */
    @PutMapping("/{id}/price")
    public ResponseEntity<?> updatePrice(@PathVariable Long id,
                                         @RequestBody ProductDto dto,
                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromToken(token);
        if (user == null) return ResponseEntity.status(401).body("{\"message\":\"Unauthorized\"}");

        Product product = productService.findById(id);
        if (product == null) return ResponseEntity.status(404).body("{\"message\":\"Product not found\"}");
        if (!product.getSeller().getUsername().equals(user.getUsername()))
            return ResponseEntity.status(403).body("{\"message\":\"Forbidden\"}");

        product.setPrice(dto.getPrice());
        productService.save(product);

        return ResponseEntity.ok(productService.toDto(product));
    }

    /**
     * Delete a product by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
