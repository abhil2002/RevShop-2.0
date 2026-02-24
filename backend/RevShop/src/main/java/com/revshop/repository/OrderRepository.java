package com.revshop.repository;

import com.revshop.entity.Order;
import com.revshop.entity.Product;
import com.revshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Buyer order history
    List<Order> findByBuyer(User buyer);

    // Seller order view (all orders containing seller's products)
    @Query("""
           SELECT DISTINCT o FROM Order o
           JOIN o.items i
           WHERE i.product.seller = :seller
           ORDER BY o.orderDate DESC
           """)
    List<Order> findOrdersBySeller(@Param("seller") User seller);

    // 🔥 Optimized purchase validation (for review system)
    @Query("""
           SELECT COUNT(o) > 0 FROM Order o
           JOIN o.items i
           WHERE o.buyer = :buyer
           AND i.product = :product
           """)
    boolean existsByBuyerAndProduct(@Param("buyer") User buyer,
                                    @Param("product") Product product);
}