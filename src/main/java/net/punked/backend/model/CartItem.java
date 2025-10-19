package net.punked.backend.model;

import jakarta.persistence.*;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private int qty;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public CartItem() {}

    public CartItem(String name, double price, int qty, User user) {
        this.name = name;
        this.price = price;
        this.qty = qty;
        this.user = user;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public int getQty() { return qty; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPrice(double price) { this.price = price; }
    public void setQty(int qty) { this.qty = qty; }
    public void setUser(User user) { this.user = user; }
}
