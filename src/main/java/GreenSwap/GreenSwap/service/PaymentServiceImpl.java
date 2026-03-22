package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.enums.OrderStatus;
import GreenSwap.GreenSwap.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl {

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    private final OrderRepository orderRepository;

    public Map<String, String> createPaymentIntent(long amountCents) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountCents)
                .setCurrency("usd")
                .build();
        PaymentIntent intent = PaymentIntent.create(params);
        return Map.of("clientSecret", intent.getClientSecret());
    }

    public void handleWebhook(byte[] payload, String sigHeader)
            throws StripeException {
        Event event = Webhook.constructEvent(
                new String(payload, StandardCharsets.UTF_8), sigHeader, webhookSecret);

        if ("payment_intent.succeeded".equals(event.getType())) {
            event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
                PaymentIntent intent = (PaymentIntent) obj;
                orderRepository.findByStripePaymentIntentId(intent.getId()).ifPresent(order -> {
                    order.setStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order);
                });
            });
        } else if ("payment_intent.payment_failed".equals(event.getType())) {
            event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
                PaymentIntent intent = (PaymentIntent) obj;
                orderRepository.findByStripePaymentIntentId(intent.getId()).ifPresent(order -> {
                    order.setStatus(OrderStatus.CANCELLED);
                    orderRepository.save(order);
                });
            });
        }
    }
}
