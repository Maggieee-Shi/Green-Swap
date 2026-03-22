package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer inventory;
    private String category;
    private String condition;
    private String imageUrl;
    private String sellerId;
    private String sellerName;
    private String brand;
    private String location;
    private boolean sold;
    private String createdAt;

    public static ProductResponse from(Product product) {
        ProductResponse r = new ProductResponse();
        r.setId(String.valueOf(product.getId()));
        r.setName(product.getName());
        r.setDescription(product.getDescription());
        r.setPrice(product.getPrice());
        r.setInventory(product.getInventory());
        r.setCategory(product.getCategory() != null ? product.getCategory().name() : null);
        r.setCondition(product.getCondition() != null ? product.getCondition().name() : null);
        r.setImageUrl(product.getImageUrl());
        r.setSellerId(product.getSeller() != null ? String.valueOf(product.getSeller().getId()) : null);
        r.setSellerName(product.getSeller() != null ? product.getSeller().getName() : null);
        r.setBrand(product.getBrand());
        r.setLocation(product.getLocation());
        r.setSold(product.isSold());
        r.setCreatedAt(product.getCreatedAt() != null ? product.getCreatedAt().toString() : null);
        return r;
    }
}
