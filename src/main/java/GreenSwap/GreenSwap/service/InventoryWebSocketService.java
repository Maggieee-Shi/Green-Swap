package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.dto.response.InventoryUpdateMessage;
import GreenSwap.GreenSwap.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastInventoryUpdate(Product product) {
        InventoryUpdateMessage message = new InventoryUpdateMessage(
                String.valueOf(product.getId()),
                product.getInventory(),
                System.currentTimeMillis()
        );
        messagingTemplate.convertAndSend("/topic/inventory", message);
    }
}
