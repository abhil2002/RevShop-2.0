package com.revshop.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SellerOrderItem {

    private String productName;
    private Integer quantity;
    private Double price;
}
