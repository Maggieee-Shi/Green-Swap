package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.dto.request.SendMessageRequest;
import GreenSwap.GreenSwap.dto.request.StartConversationRequest;
import GreenSwap.GreenSwap.dto.response.ConversationResponse;
import GreenSwap.GreenSwap.dto.response.MessageResponse;
import GreenSwap.GreenSwap.exception.ResourceNotFoundException;
import GreenSwap.GreenSwap.model.Conversation;
import GreenSwap.GreenSwap.model.Message;
import GreenSwap.GreenSwap.model.Product;
import GreenSwap.GreenSwap.model.User;
import GreenSwap.GreenSwap.repository.ConversationRepository;
import GreenSwap.GreenSwap.repository.MessageRepository;
import GreenSwap.GreenSwap.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ConversationResponse startConversation(StartConversationRequest request, User buyer) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.getProductId()));

        User seller = product.getSeller();
        if (seller == null) {
            throw new ResourceNotFoundException("This product has no seller");
        }
        if (seller.getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("You cannot message yourself about your own listing");
        }

        Conversation conversation = conversationRepository
                .findByProductAndBuyer(product, buyer)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setProduct(product);
                    c.setBuyer(buyer);
                    c.setSeller(seller);
                    return conversationRepository.save(c);
                });

        // Send the initial message
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(buyer);
        message.setContent(request.getMessage());
        messageRepository.save(message);

        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        // Notify seller via WebSocket
        MessageResponse msgResponse = MessageResponse.from(message);
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversation.getId(), msgResponse);

        return ConversationResponse.from(conversation);
    }

    @Transactional
    public MessageResponse sendMessage(Long conversationId, SendMessageRequest request, User sender) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + conversationId));

        if (!conversation.getBuyer().getId().equals(sender.getId())
                && !conversation.getSeller().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Not a participant of this conversation");
        }

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(request.getContent());
        messageRepository.save(message);

        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageResponse response = MessageResponse.from(message);
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversation.getId(), response);

        return response;
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getMyConversations(User user) {
        return conversationRepository.findByParticipant(user)
                .stream()
                .map(ConversationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(Long conversationId, User user) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + conversationId));

        if (!conversation.getBuyer().getId().equals(user.getId())
                && !conversation.getSeller().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not a participant of this conversation");
        }

        return messageRepository.findByConversationOrderBySentAtAsc(conversation)
                .stream()
                .map(MessageResponse::from)
                .collect(Collectors.toList());
    }
}
