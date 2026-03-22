package GreenSwap.GreenSwap.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer inventory;
    private String category;
    private String condition;
    private String imageUrl;
}
