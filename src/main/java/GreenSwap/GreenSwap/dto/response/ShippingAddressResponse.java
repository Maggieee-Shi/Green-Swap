package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddressResponse {
    private String address;
    private String city;
    private String state;
    private String zipCode;

    public static ShippingAddressResponse from(ShippingAddress sa) {
        return new ShippingAddressResponse(sa.getAddress(), sa.getCity(), sa.getState(), sa.getZipCode());
    }
}
