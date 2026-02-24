package com.revshop.controller;

import com.revshop.dto.SellerOrderResponse;
import com.revshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<SellerOrderResponse> getSellerOrders() {
        return orderService.getSellerOrders();
    }
}
