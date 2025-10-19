package net.punked.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    @Column(length = 2000)
    private String content;

    private Instant sentAt = Instant.now();

    // New fields for frontend inbox
    private String productName; // optional product involved in request
    private String type; // "purchase-request" or "seller-request"
    private String status; // "pending", "approved", "rejected"

    public Message() {}

    public Message(User sender, User receiver, String content, String productName, String type, String status) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.productName = productName;
        this.type = type;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getSentAt() { return sentAt; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
