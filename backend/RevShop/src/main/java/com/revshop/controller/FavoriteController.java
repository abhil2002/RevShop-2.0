package com.revshop.controller;

import com.revshop.dto.ApiResponse;
import com.revshop.dto.FavoriteRequest;
import com.revshop.dto.ProductResponse;
import com.revshop.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUYER')")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addToFavorites(
            @Valid @RequestBody FavoriteRequest request) {

        // ✅ Updated line
        favoriteService.addToFavorites(request.getProductId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Void>builder()
                        .success(true)
                        .message("Product added to favorites successfully")
                        .data(null)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFavorites() {

        // ✅ Updated return type
        List<ProductResponse> favorites = favoriteService.getFavorites();

        return ResponseEntity.ok(
                ApiResponse.<List<ProductResponse>>builder()
                        .success(true)
                        .message("Favorites fetched successfully")
                        .data(favorites)
                        .build());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromFavorites(
            @PathVariable Long productId) {

        favoriteService.removeFromFavorites(productId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Product removed from favorites successfully")
                        .data(null)
                        .build());
    }
}