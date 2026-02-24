package com.revshop.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SellerOrderResponse {

    private Long orderId;
    private String buyerEmail;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private List<SellerOrderItem> items;
}
