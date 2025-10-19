package net.punked.backend.dto;

import java.util.List;

public class ProductDto {

    private Long id;
    private String title;
    private String genre;
    private String size;
    private String condition;
    private String category;
    private String color;
    private String description;
    private Double price;
    private String image;         // main image
    private List<String> images;  // all uploaded images
    private String saleType;      // "approval" or "instant"
    private String seller;        // username of seller
    private Long uploaded;        // timestamp or uploaded ID

    public ProductDto() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getSaleType() { return saleType; }
    public void setSaleType(String saleType) { this.saleType = saleType; }

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public Long getUploaded() { return uploaded; }
    public void setUploaded(Long uploaded) { this.uploaded = uploaded; }
}
