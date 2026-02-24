package com.revshop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoriteRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;
}
