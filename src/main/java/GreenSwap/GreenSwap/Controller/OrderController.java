package GreenSwap.GreenSwap.Controller;

import GreenSwap.GreenSwap.dto.request.CreateOrderRequest;
import GreenSwap.GreenSwap.dto.response.OrderResponse;
import GreenSwap.GreenSwap.model.User;
import GreenSwap.GreenSwap.service.OrderServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceImpl orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.createOrder(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.findByUser(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.findById(id, currentUser));
    }
}
