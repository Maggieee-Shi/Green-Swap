package GreenSwap.GreenSwap.dto.response;

import GreenSwap.GreenSwap.model.Conversation;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConversationResponse {
    private String id;
    private String productId;
    private String productName;
    private String productImageUrl;
    private String buyerId;
    private String buyerName;
    private String sellerId;
    private String sellerName;
    private String lastMessageAt;

    public static ConversationResponse from(Conversation conversation) {
        ConversationResponse r = new ConversationResponse();
        r.setId(String.valueOf(conversation.getId()));
        r.setProductId(String.valueOf(conversation.getProduct().getId()));
        r.setProductName(conversation.getProduct().getName());
        r.setProductImageUrl(conversation.getProduct().getImageUrl());
        r.setBuyerId(String.valueOf(conversation.getBuyer().getId()));
        r.setBuyerName(conversation.getBuyer().getName());
        r.setSellerId(String.valueOf(conversation.getSeller().getId()));
        r.setSellerName(conversation.getSeller().getName());
        r.setLastMessageAt(conversation.getLastMessageAt() != null
                ? conversation.getLastMessageAt().toString() : null);
        return r;
    }
}
