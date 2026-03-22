package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.dto.request.CreateProductRequest;
import GreenSwap.GreenSwap.dto.request.UpdateProductRequest;
import GreenSwap.GreenSwap.dto.response.ProductResponse;
import GreenSwap.GreenSwap.enums.ProductCategory;
import GreenSwap.GreenSwap.enums.ProductCondition;
import GreenSwap.GreenSwap.exception.ResourceNotFoundException;
import GreenSwap.GreenSwap.model.Product;
import GreenSwap.GreenSwap.model.User;
import GreenSwap.GreenSwap.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll(String category, String condition,
                                         BigDecimal minPrice, BigDecimal maxPrice,
                                         String search, String sortStr) {
        ProductCategory cat = parseCategory(category);
        ProductCondition cond = parseCondition(condition);
        Sort sort = parseSort(sortStr);
        String searchPattern = (search == null || search.isBlank()) ? null : "%" + search.toLowerCase() + "%";
        return productRepository.findWithFilters(cat, cond, minPrice, maxPrice, searchPattern, sort)
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return ProductResponse.from(productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id)));
    }

    @Transactional
    public ProductResponse create(CreateProductRequest request, User seller) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setInventory(request.getInventory());
        product.setCategory(parseCategory(request.getCategory()));
        product.setCondition(parseCondition(request.getCondition()));
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setLocation(request.getLocation());
        product.setSeller(seller);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getInventory() != null) product.setInventory(request.getInventory());
        if (request.getCategory() != null) product.setCategory(parseCategory(request.getCategory()));
        if (request.getCondition() != null) product.setCondition(parseCondition(request.getCondition()));
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findBySeller(User seller) {
        return productRepository.findBySellerOrderByCreatedAtDesc(seller)
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse markAsSold(Long id, User currentUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        if (product.getSeller() == null || !product.getSeller().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You don't own this listing");
        }
        product.setSold(true);
        product.setInventory(0);
        return ProductResponse.from(productRepository.save(product));
    }

    private ProductCategory parseCategory(String category) {
        if (category == null || category.isBlank()) return null;
        try {
            return ProductCategory.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private ProductCondition parseCondition(String condition) {
        if (condition == null || condition.isBlank()) return null;
        try {
            return ProductCondition.valueOf(condition.toUpperCase().replace(" ", "_").replace("-", "_"));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private Sort parseSort(String sortStr) {
        if (sortStr == null) return Sort.by("createdAt").descending();
        return switch (sortStr) {
            case "price-low" -> Sort.by("price").ascending();
            case "price-high" -> Sort.by("price").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
