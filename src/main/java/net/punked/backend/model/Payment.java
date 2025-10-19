package net.punked.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user; // 👈 add this

    @Embedded
    private DeliveryInfo delivery;

    @Embedded
    private PaymentMethod payment;

    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    private double total;

    private String orderId; // 👈 add this

    public Payment() {}

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; } // 👈 needed

    public DeliveryInfo getDelivery() { return delivery; }
    public void setDelivery(DeliveryInfo delivery) { this.delivery = delivery; }

    public PaymentMethod getPayment() { return payment; }
    public void setPayment(PaymentMethod payment) { this.payment = payment; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; } // 👈 needed
}
