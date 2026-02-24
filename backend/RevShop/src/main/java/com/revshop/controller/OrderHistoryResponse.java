package com.revshop.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderHistoryResponse {

    private Long orderId;

    private LocalDateTime orderDate;

    private Double totalAmount;

    private String status;

    private String paymentStatus;

    private List<OrderItemResponse> items;
}