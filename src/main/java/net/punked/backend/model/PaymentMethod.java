package net.punked.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class PaymentMethod {
    private String method;
    private String bank;

    // Getters & setters
}
