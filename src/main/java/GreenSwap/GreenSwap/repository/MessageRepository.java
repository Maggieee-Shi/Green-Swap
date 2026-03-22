package GreenSwap.GreenSwap.repository;

import GreenSwap.GreenSwap.model.Conversation;
import GreenSwap.GreenSwap.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
}
