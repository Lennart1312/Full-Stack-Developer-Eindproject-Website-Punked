package net.punked.backend.service;

import net.punked.backend.model.Product;
import net.punked.backend.model.User;
import net.punked.backend.dto.ProductDto;
import net.punked.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Get all products
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Get product by ID
     * Throws RuntimeException if product not found
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    /**
     * Get products by seller username
     */
    public List<Product> getProductsBySeller(String seller) {
        return productRepository.findBySeller(seller);
    }

    /**
     * Get products by seller User entity
     */
    public List<Product> findBySeller(User seller) {
        return productRepository.findBySeller(seller);
    }

    /**
     * Save or update a product
     */
    public Product saveProduct(Product product) {
        if (product.getUploaded() == null) {
            product.setUploaded(LocalDateTime.now());
        }

        // Set imageUrl from first uploaded image if not provided
        if (product.getImageUrl() == null && product.getImages() != null && !product.getImages().isEmpty()) {
            product.setImageUrl(product.getImages().get(0));
        }

        return productRepository.save(product);
    }

    /**
     * Delete a product by ID
     */
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    /**
     * Convert Product entity to ProductDto
     */
    public ProductDto toDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setGenre(p.getGenre());
        dto.setSize(p.getSize());
        dto.setCondition(p.getCondition());
        dto.setCategory(p.getCategory());
        dto.setColor(p.getColor());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setImage(p.getImageUrl());
        dto.setImages(p.getImages());
        dto.setSaleType(p.getSaleType());
        dto.setSeller(p.getSeller() != null ? p.getSeller().getUsername() : null);
        dto.setUploaded(p.getUploaded() != null ? p.getUploaded().atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() : null);
        return dto;
    }

    /**
     * --- Added for ProductController compatibility ---
     */

    // Returns product or null if not found
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Delegates to saveProduct
    public Product save(Product product) {
        return saveProduct(product);
    }
}
