package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserResponse user;

    public static AuthResponse from(String token, User user) {
        return new AuthResponse(token, UserResponse.from(user));
    }
}
