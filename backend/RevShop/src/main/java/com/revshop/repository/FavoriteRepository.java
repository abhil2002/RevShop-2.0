package com.revshop.repository;

import com.revshop.entity.Favorite;
import com.revshop.entity.Product;
import com.revshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByBuyer(User buyer);

    Optional<Favorite> findByBuyerIdAndProductId(Long buyerId, Long productId);

    void deleteByBuyerIdAndProductId(Long buyerId, Long productId);

    Optional<Favorite> findByBuyerAndProduct(User buyer, Product product);
}