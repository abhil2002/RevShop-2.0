package com.revshop.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/role")
public class RoleTestController {

    @GetMapping("/buyer")
    @PreAuthorize("hasRole('BUYER')")
    public String buyerAccess() {
        return "Buyer endpoint accessed!";
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public String sellerAccess() {
        return "Seller endpoint accessed!";
    }
}
