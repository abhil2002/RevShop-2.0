package com.revshop.service;

import com.revshop.dto.*;
import com.revshop.dto.OrderHistoryResponse;
import com.revshop.entity.*;
import com.revshop.exception.BadRequestException;
import com.revshop.exception.ResourceNotFoundException;
import com.revshop.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final PaymentService paymentService;
    private final CurrentUserService currentUserService;

    @Transactional
    public OrderConfirmationResponse placeOrder(CheckoutRequest request) {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByBuyer(buyer);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        double totalAmount = 0.0;

        Order order = Order.builder()
                .buyer(buyer)
                .status(OrderStatus.PLACED)
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress())
                .contactPhone(request.getContactPhone())
                .orderDate(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException(
                        "Insufficient stock for " + product.getName());
            }

            // Deduct stock
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            double itemTotal =
                    product.getDiscountedPrice() * cartItem.getQuantity();

            totalAmount += itemTotal;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getDiscountedPrice())
                    .build();

            orderItems.add(orderItem);

            // 🔔 Seller notification
            notificationService.createNotification(
                    product.getSeller(),
                    "New order received for product: " + product.getName()
            );

            // 🔔 Low stock alert
            if (product.getQuantity() <= product.getStockThreshold()) {
                notificationService.createNotification(
                        product.getSeller(),
                        "Low stock alert for product: " + product.getName()
                );
            }
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        // 💳 Process payment
        PaymentResult paymentResult =
                paymentService.processPayment(
                        request.getPaymentMethod(),
                        totalAmount
                );

        if (paymentResult.status() != PaymentStatus.SUCCESS) {
            throw new BadRequestException("Payment failed");
        }

        order.setPaymentStatus(paymentResult.status());
        order.setTransactionId(paymentResult.transactionId());

        // 💾 Save order AFTER items are attached
        Order savedOrder = orderRepository.save(order);

        // 🛒 Clear cart
        cartItemRepository.deleteByBuyer(buyer);

        // 🔔 Buyer notification (ONLY here — after order saved)
        notificationService.createNotification(
                buyer,
                "Order #" + savedOrder.getId() + " placed successfully."
        );

        return OrderConfirmationResponse.builder()
                .orderId(savedOrder.getId())
                .message("Order placed successfully")
                .paymentStatus(savedOrder.getPaymentStatus().name())
                .transactionId(savedOrder.getTransactionId())
                .totalAmount(savedOrder.getTotalAmount())
                .build();
    }

    public List<OrderHistoryResponse> getOrderHistory() {

        String email = currentUserService.getCurrentUserEmail();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Order> orders = orderRepository.findByBuyer(buyer);

        return orders.stream().map(order ->
                OrderHistoryResponse.builder()
                        .orderId(order.getId())
                        .orderDate(order.getOrderDate())
                        .totalAmount(order.getTotalAmount())
                        .status(order.getStatus().name())
                        .paymentStatus(order.getPaymentStatus().name())
                        .items(order.getItems().stream()
                                .map(item -> OrderItemResponse.builder()
                                        .productName(item.getProduct().getName())
                                        .quantity(item.getQuantity())
                                        .price(item.getPrice())
                                        .build())
                                .toList())
                        .build()
        ).toList();
    }

    public List<SellerOrderResponse> getSellerOrders() {

        String email = currentUserService.getCurrentUserEmail();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        List<Order> orders = orderRepository.findOrdersBySeller(seller);

        return orders.stream().map(order -> {

            List<SellerOrderItem> items = order.getItems().stream()
                    .filter(item ->
                            item.getProduct().getSeller()
                                    .getId()
                                    .equals(seller.getId()))
                    .map(item -> SellerOrderItem.builder()
                            .productName(item.getProduct().getName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .build())
                    .toList();

            return SellerOrderResponse.builder()
                    .orderId(order.getId())
                    .buyerEmail(order.getBuyer().getEmail())
                    .orderDate(order.getOrderDate())
                    .totalAmount(order.getTotalAmount())
                    .items(items)
                    .build();

        }).toList();
    }
}