package GreenSwap.GreenSwap.Controller;

import GreenSwap.GreenSwap.dto.request.CreateProductRequest;
import GreenSwap.GreenSwap.dto.request.UpdateProductRequest;
import GreenSwap.GreenSwap.dto.response.ProductResponse;
import GreenSwap.GreenSwap.model.User;
import GreenSwap.GreenSwap.service.ProductServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceImpl productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(productService.findAll(category, condition, minPrice, maxPrice, search, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody CreateProductRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(productService.create(request, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProductResponse>> getMyListings(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(productService.findBySeller(currentUser));
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<ProductResponse> markAsSold(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(productService.markAsSold(id, currentUser));
    }
}
