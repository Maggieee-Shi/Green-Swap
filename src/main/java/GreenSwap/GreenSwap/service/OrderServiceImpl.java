package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.dto.request.CreateOrderRequest;
import GreenSwap.GreenSwap.dto.response.OrderResponse;
import GreenSwap.GreenSwap.enums.OrderStatus;
import GreenSwap.GreenSwap.enums.Role;
import GreenSwap.GreenSwap.exception.InsufficientInventoryException;
import GreenSwap.GreenSwap.exception.ResourceNotFoundException;
import GreenSwap.GreenSwap.model.*;
import GreenSwap.GreenSwap.repository.OrderRepository;
import GreenSwap.GreenSwap.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryWebSocketService inventoryWebSocketService;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, User user) {
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        var addrReq = request.getShippingAddress();
        order.setShippingAddress(new ShippingAddress(
                addrReq.getAddress(), addrReq.getCity(), addrReq.getState(), addrReq.getZipCode()));

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var itemReq : request.getItems()) {
            Long productId = Long.parseLong(itemReq.getProductId());

            Product product = productRepository.findByIdWithLock(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

            if (product.getInventory() < itemReq.getQuantity()) {
                throw new InsufficientInventoryException(
                        "Insufficient inventory for: " + product.getName());
            }

            product.setInventory(product.getInventory() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(product.getPrice());
            items.add(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        order.setItems(items);
        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        // Broadcast inventory updates via WebSocket
        for (OrderItem item : items) {
            inventoryWebSocketService.broadcastInventoryUpdate(item.getProduct());
        }

        return OrderResponse.from(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findByUser(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id, User user) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new ResourceNotFoundException("Order not found: " + id);
        }
        return OrderResponse.from(order);
    }
}
