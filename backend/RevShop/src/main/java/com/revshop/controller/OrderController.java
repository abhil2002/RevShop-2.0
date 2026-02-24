package com.revshop.controller;

import com.revshop.dto.*;
import com.revshop.dto.OrderHistoryResponse;
import com.revshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUYER')")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderConfirmationResponse>> checkout(
            @Valid @RequestBody CheckoutRequest request) {

        OrderConfirmationResponse response =
                orderService.placeOrder(request);

        return ResponseEntity.ok(
                ApiResponse.<OrderConfirmationResponse>builder()
                        .success(true)
                        .message("Order placed successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderHistoryResponse>>> orderHistory() {

        List<OrderHistoryResponse> history =
                orderService.getOrderHistory();

        return ResponseEntity.ok(
                ApiResponse.<List<OrderHistoryResponse>>builder()
                        .success(true)
                        .message("Order history fetched successfully")
                        .data(history)
                        .build()
        );
    }
}