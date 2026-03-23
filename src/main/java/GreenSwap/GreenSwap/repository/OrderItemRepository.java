package GreenSwap.GreenSwap.repository;

import GreenSwap.GreenSwap.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Modifying
    @Query("UPDATE OrderItem o SET o.product = null WHERE o.product.id = :productId")
    void nullifyProduct(Long productId);
}
