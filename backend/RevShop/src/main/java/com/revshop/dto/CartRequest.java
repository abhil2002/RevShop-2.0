package com.revshop.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartRequest {

    @NotNull
    private Long productId;

    @NotNull
    @Positive
    private Integer quantity;
}
