package com.revshop.repository;

import com.revshop.entity.Product;
import com.revshop.entity.Review;
import com.revshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);

    boolean existsByProductAndBuyer(Product product, User buyer);
}
