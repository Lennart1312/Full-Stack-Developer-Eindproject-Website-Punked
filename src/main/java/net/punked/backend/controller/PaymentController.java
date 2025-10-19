package net.punked.backend.controller;

import net.punked.backend.model.Payment;
import net.punked.backend.model.User;
import net.punked.backend.service.PaymentService;
import net.punked.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    /**
     * Process a payment and create a Payment record
     */
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Payment payment,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user from token
            String token = authHeader.replace("Bearer ", "");
            User user = userService.getUserFromToken(token);

            // Associate payment with user
            payment.setUser(user);

            // Let service process payment (generate orderId, calculate total, save)
            Payment saved = paymentService.processPayment(payment);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Payment failed: " + e.getMessage());
        }
    }
}
