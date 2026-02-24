package com.revshop.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;


public enum PaymentMethod {
    COD,
    CREDIT_CARD,
    DEBIT_CARD,
    UPI,
    CARD
}
