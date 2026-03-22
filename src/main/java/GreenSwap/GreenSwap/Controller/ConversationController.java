package GreenSwap.GreenSwap.Controller;

import GreenSwap.GreenSwap.dto.request.SendMessageRequest;
import GreenSwap.GreenSwap.dto.request.StartConversationRequest;
import GreenSwap.GreenSwap.dto.response.ConversationResponse;
import GreenSwap.GreenSwap.dto.response.MessageResponse;
import GreenSwap.GreenSwap.model.User;
import GreenSwap.GreenSwap.service.ConversationServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationServiceImpl conversationService;

    @PostMapping
    public ResponseEntity<ConversationResponse> start(
            @Valid @RequestBody StartConversationRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(conversationService.startConversation(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getMyConversations(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(conversationService.getMyConversations(currentUser));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(conversationService.getMessages(id, currentUser));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(conversationService.sendMessage(id, request, currentUser));
    }
}
