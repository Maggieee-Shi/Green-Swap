package GreenSwap.GreenSwap.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;

    @NotNull
    @Valid
    private ShippingAddressRequest shippingAddress;
}
