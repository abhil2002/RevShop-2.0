package com.revshop.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private String buyerEmail;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
