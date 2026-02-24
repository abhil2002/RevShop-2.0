package com.revshop.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderConfirmationResponse {

    private Long orderId;

    private String message;

    private String paymentStatus;

    private String transactionId;

    private Double totalAmount;
}