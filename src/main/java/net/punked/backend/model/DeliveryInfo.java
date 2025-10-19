package net.punked.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class DeliveryInfo {
    private String fullName;
    private String address;
    private String phone;

    // Getters & setters
}
