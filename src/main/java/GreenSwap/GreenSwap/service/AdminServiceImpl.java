package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.dto.response.AdminStatsResponse;
import GreenSwap.GreenSwap.dto.response.OrderResponse;
import GreenSwap.GreenSwap.dto.response.UserResponse;
import GreenSwap.GreenSwap.enums.OrderStatus;
import GreenSwap.GreenSwap.repository.OrderRepository;
import GreenSwap.GreenSwap.repository.ProductRepository;
import GreenSwap.GreenSwap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        BigDecimal revenue = orderRepository.sumRevenueExcluding(OrderStatus.CANCELLED);
        long orders = orderRepository.count();
        long users = userRepository.count();
        long products = productRepository.count();
        return new AdminStatsResponse(
                revenue != null ? revenue : BigDecimal.ZERO,
                orders, users, products);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }
}
