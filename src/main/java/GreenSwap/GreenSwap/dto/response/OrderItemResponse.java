package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.OrderItem;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class OrderItemResponse {
    private String productId;
    private String productName;
    private BigDecimal priceAtPurchase;
    private Integer quantity;

    public static OrderItemResponse from(OrderItem item) {
        OrderItemResponse r = new OrderItemResponse();
        r.setProductId(String.valueOf(item.getProduct().getId()));
        r.setProductName(item.getProduct().getName());
        r.setPriceAtPurchase(item.getPriceAtPurchase());
        r.setQuantity(item.getQuantity());
        return r;
    }
}
