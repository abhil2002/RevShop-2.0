package com.revshop.service;

import com.revshop.entity.PaymentMethod;
import com.revshop.entity.PaymentStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    public PaymentResult processPayment(PaymentMethod method, double amount) {

        // Simulate payment processing logic
        // You can extend this with failure simulation if needed

        if (amount <= 0) {
            return new PaymentResult(
                    PaymentStatus.FAILED,
                    null
            );
        }

        // Generate fake transaction ID
        String transactionId = UUID.randomUUID().toString();

        return new PaymentResult(
                PaymentStatus.SUCCESS,
                transactionId
        );
    }
}