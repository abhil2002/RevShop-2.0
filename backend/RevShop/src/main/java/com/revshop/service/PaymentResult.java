package com.revshop.service;

import com.revshop.entity.PaymentStatus;

public record PaymentResult(
        PaymentStatus status,
        String transactionId
) {}