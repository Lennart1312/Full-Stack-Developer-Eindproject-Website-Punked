package net.punked.backend.dto;

public class CartItemDto {
    private String name;
    private double price;
    private int qty;

    public CartItemDto() {}

    public CartItemDto(String name, double price, int qty) {
        this.name = name;
        this.price = price;
        this.qty = qty;
    }

    // Getters and setters
    public String getName() { return name; }
    public double getPrice() { return price; }
    public int getQty() { return qty; }

    public void setName(String name) { this.name = name; }
    public void setPrice(double price) { this.price = price; }
    public void setQty(int qty) { this.qty = qty; }
}
