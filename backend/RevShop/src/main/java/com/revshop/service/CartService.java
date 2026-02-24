package com.revshop.service;

import com.revshop.dto.CartRequest;
import com.revshop.dto.CartResponse;
import com.revshop.entity.CartItem;
import com.revshop.entity.Product;
import com.revshop.entity.User;
import com.revshop.exception.BadRequestException;
import com.revshop.exception.ResourceNotFoundException;
import com.revshop.repository.CartItemRepository;
import com.revshop.repository.ProductRepository;
import com.revshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public void addToCart(CartRequest request) {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found: " + request.getProductId()
                ));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        if (product.getQuantity() < request.getQuantity()) {
            throw new BadRequestException("Not enough stock available");
        }

        CartItem cartItem = cartItemRepository
                .findByBuyerAndProductId(buyer, product.getId())
                .orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = CartItem.builder()
                    .buyer(buyer)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        }

        cartItemRepository.save(cartItem);
    }

    public List<CartResponse> viewCart() {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> items = cartItemRepository.findByBuyer(buyer);

        return items.stream()
                .map(item -> CartResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .price(item.getProduct().getDiscountedPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getProduct().getDiscountedPrice()
                                * item.getQuantity())
                        .build())
                .toList();
    }

    // 🔥 FIXED: delete by productId (NOT cartItemId)
    public void removeFromCart(Long productId) {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CartItem cartItem = cartItemRepository
                .findByBuyerAndProductId(buyer, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cartItemRepository.delete(cartItem);
    }

    public void updateCartQuantity(Long productId, Integer quantity) {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CartItem cartItem = cartItemRepository
                .findByBuyerAndProductId(buyer, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        if (cartItem.getProduct().getQuantity() < quantity) {
            throw new BadRequestException("Not enough stock available");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
    }
}