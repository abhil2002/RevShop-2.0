package com.revshop.controller;

import com.revshop.dto.ApiResponse;
import com.revshop.dto.ReviewRequest;
import com.revshop.dto.ReviewResponse;
import com.revshop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @RequestBody ReviewRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<ReviewResponse>builder()
                        .success(true)
                        .message("Review added successfully")
                        .data(reviewService.addReview(request))
                        .build()
        );
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<?>> getProductReviews(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Reviews fetched successfully")
                        .data(reviewService.getProductReviews(productId))
                        .build()
        );
    }

    @GetMapping("/seller/{productId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<?>> getSellerReviews(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Seller reviews fetched successfully")
                        .data(reviewService
                                .getReviewsForSellerProduct(productId))
                        .build()
        );
    }
}
