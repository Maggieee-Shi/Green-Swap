package GreenSwap.GreenSwap.repository;

import GreenSwap.GreenSwap.enums.OrderStatus;
import GreenSwap.GreenSwap.model.Order;
import GreenSwap.GreenSwap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status <> :excludedStatus")
    BigDecimal sumRevenueExcluding(@Param("excludedStatus") OrderStatus excludedStatus);
}
