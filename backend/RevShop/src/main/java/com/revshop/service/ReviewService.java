package com.revshop.service;

import com.revshop.dto.ReviewRequest;
import com.revshop.dto.ReviewResponse;
import com.revshop.entity.*;
import com.revshop.exception.BadRequestException;
import com.revshop.exception.ResourceNotFoundException;
import com.revshop.exception.UnauthorizedException;
import com.revshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CurrentUserService currentUserService;

    public ReviewResponse addReview(ReviewRequest request) {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Optimized purchase validation (DB-level check)
        boolean purchased = orderRepository.existsByBuyerAndProduct(buyer, product);

        if (!purchased) {
            throw new UnauthorizedException(
                    "You cannot review a product you haven't purchased");
        }

        if (reviewRepository.existsByProductAndBuyer(product, buyer)) {
            throw new BadRequestException(
                    "You already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .buyer(buyer)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        reviewRepository.save(review);

        return mapToResponse(review);
    }

    public List<ReviewResponse> getProductReviews(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return reviewRepository.findByProduct(product)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsForSellerProduct(Long productId) {

        String email = currentUserService.getCurrentUserEmail();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new UnauthorizedException(
                    "You are not authorized to view these reviews");
        }

        return reviewRepository.findByProduct(product)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ReviewResponse mapToResponse(Review review) {

        return ReviewResponse.builder()
                .buyerEmail(review.getBuyer().getEmail())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}