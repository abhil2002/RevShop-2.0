package com.revshop.controller;

import com.revshop.dto.ApiResponse;
import com.revshop.dto.CartRequest;
import com.revshop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUYER')")
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addToCart(
            @RequestBody CartRequest request) {

        cartService.addToCart(request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Product added to cart")
                        .data(null)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> viewCart() {

        var response = cartService.viewCart();

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Cart fetched successfully")
                        .data(response)
                        .build());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable Long productId) {

        cartService.removeFromCart(productId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Product removed from cart")
                        .data(null)
                        .build());
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> updateQuantity(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        cartService.updateCartQuantity(productId, quantity);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Cart updated successfully")
                        .data(null)
                        .build()
        );
    }

}
