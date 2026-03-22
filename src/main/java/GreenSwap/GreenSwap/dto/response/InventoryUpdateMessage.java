package GreenSwap.GreenSwap.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryUpdateMessage {
    private String productId;
    private Integer inventory;
    private Long timestamp;
}
