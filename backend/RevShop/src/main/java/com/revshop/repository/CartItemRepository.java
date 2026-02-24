package com.revshop.repository;

import com.revshop.entity.CartItem;
import com.revshop.entity.Product;
import com.revshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    List<CartItem> findByBuyer(User buyer);

    Optional<CartItem> findByBuyerAndProduct_Id(User buyer, Long productId);

    void deleteByBuyer(User buyer);

    Optional<CartItem> findByBuyerAndProduct(User buyer, Product product);


    Optional<CartItem> findByBuyerAndProductId(User buyer, Long productId);
}
