package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.Message;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MessageResponse {
    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String content;
    private String sentAt;

    public static MessageResponse from(Message message) {
        MessageResponse r = new MessageResponse();
        r.setId(String.valueOf(message.getId()));
        r.setConversationId(String.valueOf(message.getConversation().getId()));
        r.setSenderId(String.valueOf(message.getSender().getId()));
        r.setSenderName(message.getSender().getName());
        r.setContent(message.getContent());
        r.setSentAt(message.getSentAt().toString());
        return r;
    }
}
