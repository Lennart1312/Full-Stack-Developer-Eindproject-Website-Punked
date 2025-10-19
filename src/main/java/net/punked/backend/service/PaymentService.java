package net.punked.backend.service;

import net.punked.backend.model.Payment;
import net.punked.backend.model.OrderItem;
import net.punked.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment processPayment(Payment payment) {
        // Ensure bidirectional relation
        if (payment.getOrderItems() != null) {
            for (OrderItem item : payment.getOrderItems()) {
                item.setPayment(payment);
            }
        }

        // Calculate total
        double total = payment.getOrderItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        payment.setTotal(total);

        // Generate order ID
        payment.setOrderId(UUID.randomUUID().toString());

        // Save payment record
        return paymentRepository.save(payment);
    }
}
