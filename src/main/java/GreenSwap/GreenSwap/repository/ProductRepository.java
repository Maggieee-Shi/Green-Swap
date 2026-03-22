package GreenSwap.GreenSwap.repository;

import GreenSwap.GreenSwap.enums.ProductCategory;
import GreenSwap.GreenSwap.enums.ProductCondition;
import GreenSwap.GreenSwap.model.Product;
import GreenSwap.GreenSwap.model.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:condition IS NULL OR p.condition = :condition) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE :search " +
           "OR LOWER(p.description) LIKE :search)")
    List<Product> findWithFilters(
            @Param("category") ProductCategory category,
            @Param("condition") ProductCondition condition,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search,
            Sort sort);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") Long id);

    List<Product> findBySellerOrderByCreatedAtDesc(User seller);
}
