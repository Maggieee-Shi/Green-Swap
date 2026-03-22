package GreenSwap.GreenSwap.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartConversationRequest {

    @NotNull
    private Long productId;

    @NotBlank
    private String message;
}
