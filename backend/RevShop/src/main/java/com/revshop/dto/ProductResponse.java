package com.revshop.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private Double mrp;

    private Double discountedPrice;

    private Integer quantity;

    private String category;

    private String sellerEmail;
}
