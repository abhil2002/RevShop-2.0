package com.revshop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double mrp;
    private Double discountedPrice;
    private Integer quantity;
    private Integer stockThreshold;
    private String category;

    @ManyToOne
    private User seller;

    private LocalDateTime createdAt;

    @Version
    private Long version;
}
