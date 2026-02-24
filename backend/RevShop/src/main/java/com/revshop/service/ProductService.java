package com.revshop.service;

import com.revshop.dto.ProductRequest;
import com.revshop.dto.ProductResponse;
import com.revshop.entity.Product;
import com.revshop.entity.User;
import com.revshop.exception.BadRequestException;
import com.revshop.exception.ResourceNotFoundException;
import com.revshop.exception.UnauthorizedException;
import com.revshop.repository.ProductRepository;
import com.revshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public ProductResponse addProduct(ProductRequest request) {

        String email = currentUserService.getCurrentUserEmail();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seller not found"));

        validatePricing(request.getMrp(), request.getDiscountedPrice());

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .mrp(request.getMrp())
                .discountedPrice(request.getDiscountedPrice())
                .quantity(request.getQuantity())
                .stockThreshold(request.getStockThreshold())
                .category(request.getCategory())
                .seller(seller)
                .createdAt(LocalDateTime.now())
                .build();

        productRepository.save(product);

        return mapToResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {

        String email = currentUserService.getCurrentUserEmail();

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getEmail().equals(email)) {
            throw new UnauthorizedException(
                    "You are not authorized to update this product");
        }

        validatePricing(request.getMrp(), request.getDiscountedPrice());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setMrp(request.getMrp());
        product.setDiscountedPrice(request.getDiscountedPrice());
        product.setQuantity(request.getQuantity());
        product.setStockThreshold(request.getStockThreshold());
        product.setCategory(request.getCategory());

        productRepository.save(product);

        return mapToResponse(product);
    }

    public void deleteProduct(Long id) {

        String email = currentUserService.getCurrentUserEmail();

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getEmail().equals(email)) {
            throw new UnauthorizedException(
                    "You are not authorized to delete this product");
        }

        productRepository.delete(product);
    }

    public Page<ProductResponse> getAllProducts(int page, int size) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());

        return productRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public Page<ProductResponse> search(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return productRepository
                .findByNameContainingIgnoreCase(keyword, pageable)
                .map(this::mapToResponse);
    }

    public Page<ProductResponse> getByCategory(String category, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return productRepository
                .findByCategory(category, pageable)
                .map(this::mapToResponse);
    }

    public Page<ProductResponse> getSellerProducts(int page, int size) {

        String email = currentUserService.getCurrentUserEmail();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seller not found"));

        Pageable pageable = PageRequest.of(page, size);

        return productRepository
                .findBySeller(seller, pageable)
                .map(this::mapToResponse);
    }

    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        return mapToResponse(product);
    }

    private void validatePricing(Double mrp, Double discountedPrice) {

        if (mrp == null || discountedPrice == null) {
            throw new BadRequestException("Pricing values cannot be null");
        }

        if (discountedPrice > mrp) {
            throw new BadRequestException(
                    "Discounted price cannot exceed MRP");
        }

        if (mrp <= 0 || discountedPrice < 0) {
            throw new BadRequestException(
                    "Invalid pricing values");
        }
    }

    private ProductResponse mapToResponse(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .mrp(product.getMrp())
                .discountedPrice(product.getDiscountedPrice())
                .quantity(product.getQuantity())
                .category(product.getCategory())
                .sellerEmail(product.getSeller().getEmail())
                .build();
    }
}