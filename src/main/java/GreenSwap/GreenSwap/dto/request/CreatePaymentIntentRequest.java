package GreenSwap.GreenSwap.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePaymentIntentRequest {
    @NotNull
    @Min(1)
    private Long amountCents;
}
