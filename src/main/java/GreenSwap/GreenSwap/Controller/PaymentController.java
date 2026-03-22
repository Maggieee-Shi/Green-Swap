package GreenSwap.GreenSwap.Controller;

import GreenSwap.GreenSwap.dto.request.CreatePaymentIntentRequest;
import GreenSwap.GreenSwap.service.PaymentServiceImpl;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServiceImpl paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createIntent(
            @Valid @RequestBody CreatePaymentIntentRequest request) throws StripeException {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request.getAmountCents()));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody byte[] payload,
            @RequestHeader("Stripe-Signature") String sigHeader) throws StripeException {
        paymentService.handleWebhook(payload, sigHeader);
        return ResponseEntity.ok().build();
    }
}
