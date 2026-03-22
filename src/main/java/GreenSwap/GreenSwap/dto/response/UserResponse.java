package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String role;

    public static UserResponse from(User user) {
        return new UserResponse(
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getName(),
                user.getRole().name().toLowerCase()
        );
    }
}
