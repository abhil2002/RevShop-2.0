package com.revshop.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartResponse {

    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private Double subtotal;
}
