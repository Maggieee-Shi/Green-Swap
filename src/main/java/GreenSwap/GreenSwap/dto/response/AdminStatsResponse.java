package GreenSwap.GreenSwap.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalUsers;
    private long totalProducts;
}
