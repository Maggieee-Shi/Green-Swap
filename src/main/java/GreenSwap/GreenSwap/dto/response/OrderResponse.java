package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.Order;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class OrderResponse {
    private String id;
    private List<OrderItemResponse> items;
    private BigDecimal total;
    private String date;
    private String status;
    private ShippingAddressResponse shippingAddress;

    public static OrderResponse from(Order order) {
        OrderResponse r = new OrderResponse();
        r.setId(String.valueOf(order.getId()));
        r.setItems(order.getItems().stream()
                .map(OrderItemResponse::from)
                .collect(Collectors.toList()));
        r.setTotal(order.getTotalAmount());
        r.setDate(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);
        r.setStatus(order.getStatus().name().toLowerCase());
        if (order.getShippingAddress() != null) {
            r.setShippingAddress(ShippingAddressResponse.from(order.getShippingAddress()));
        }
        return r;
    }
}
