package GreenSwap.GreenSwap.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShippingAddressRequest {
    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String zipCode;
}
