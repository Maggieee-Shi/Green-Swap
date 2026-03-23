package GreenSwap.GreenSwap.repository;

import GreenSwap.GreenSwap.model.Conversation;
import GreenSwap.GreenSwap.model.Product;
import GreenSwap.GreenSwap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByProductAndBuyer(Product product, User buyer);

    @Query("SELECT c FROM Conversation c WHERE c.buyer = :user OR c.seller = :user ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByParticipant(@Param("user") User user);

    List<Conversation> findByProductId(Long productId);
}
