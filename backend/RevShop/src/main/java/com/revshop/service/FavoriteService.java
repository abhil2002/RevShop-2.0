package com.revshop.service;

import com.revshop.dto.ProductResponse;
import com.revshop.entity.Favorite;
import com.revshop.entity.Product;
import com.revshop.entity.User;
import com.revshop.exception.BadRequestException;
import com.revshop.exception.ResourceNotFoundException;
import com.revshop.repository.FavoriteRepository;
import com.revshop.repository.ProductRepository;
import com.revshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public void addToFavorites(Long productId) {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (favoriteRepository.findByBuyerAndProduct(buyer, product).isPresent()) {
            throw new BadRequestException("Product already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .buyer(buyer)
                .product(product)
                .build();

        favoriteRepository.save(favorite);
    }

    public List<ProductResponse> getFavorites() {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return favoriteRepository.findByBuyer(buyer)
                .stream()
                .map(Favorite::getProduct)
                .map(this::mapToResponse)
                .toList();
    }

    public void removeFromFavorites(Long productId) {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Favorite favorite = favoriteRepository
                .findByBuyerIdAndProductId(buyer.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));

        favoriteRepository.delete(favorite);
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