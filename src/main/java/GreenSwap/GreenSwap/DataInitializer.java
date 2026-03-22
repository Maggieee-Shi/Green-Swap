package GreenSwap.GreenSwap;

import GreenSwap.GreenSwap.enums.ProductCategory;
import GreenSwap.GreenSwap.enums.ProductCondition;
import GreenSwap.GreenSwap.enums.Role;
import GreenSwap.GreenSwap.model.Product;
import GreenSwap.GreenSwap.model.User;
import GreenSwap.GreenSwap.repository.ProductRepository;
import GreenSwap.GreenSwap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (productRepository.count() > 0) return;

        // Create a demo admin user to own the seeded listings
        User admin = userRepository.findByEmail("admin@greenswap.com").orElseGet(() -> {
            User u = new User();
            u.setName("GreenSwap Admin");
            u.setEmail("admin@greenswap.com");
            u.setPassword(passwordEncoder.encode("Admin123!"));
            u.setRole(Role.ADMIN);
            return userRepository.save(u);
        });

        seed(admin, "TaylorMade Stealth 2 Driver", 349, ProductCondition.EXCELLENT, ProductCategory.DRIVERS,
                "TaylorMade", "San Diego, CA",
                "Barely used TaylorMade Stealth 2 Driver, 10.5° loft. Incredible distance and forgiveness. Comes with headcover.",
                "https://images.unsplash.com/photo-1697448524524-99416ed5dbba?w=600", 1);

        seed(admin, "Scotty Cameron Newport 2 Putter", 275, ProductCondition.VERY_GOOD, ProductCategory.PUTTERS,
                "Scotty Cameron", "Austin, TX",
                "Classic Scotty Cameron Newport 2. 34 inch. Great feel and balance. Minor cosmetic wear on sole.",
                "https://images.unsplash.com/photo-1722849899776-3c6abb5a46c7?w=600", 2);

        seed(admin, "Titleist T200 Iron Set (4-PW)", 799, ProductCondition.EXCELLENT, ProductCategory.IRONS,
                "Titleist", "Phoenix, AZ",
                "Titleist T200 irons, 4-PW (7 clubs). Steel shafts, regular flex. Only played 10 rounds. Amazing distance and control.",
                "https://images.unsplash.com/photo-1761233976530-d09fc58ad175?w=600", 1);

        seed(admin, "Callaway Golf Bag - Org 14", 189, ProductCondition.VERY_GOOD, ProductCategory.BAGS,
                "Callaway", "Orlando, FL",
                "Callaway Org 14 cart bag. 14-way top, plenty of pockets. Some dirt marks but structurally perfect.",
                "https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?w=600", 3);

        seed(admin, "FootJoy Pro SL Golf Shoes", 95, ProductCondition.GOOD, ProductCategory.SHOES,
                "FootJoy", "Seattle, WA",
                "FootJoy Pro SL shoes, size 10.5. Comfortable and waterproof. Worn for one season. Minor wear on spikes.",
                "https://images.unsplash.com/photo-1761074974307-c4e5c51a9156?w=600", 4);

        seed(admin, "Pro V1 Golf Balls (Dozen)", 35, ProductCondition.GOOD, ProductCategory.BALLS,
                "Titleist", "Denver, CO",
                "Mixed dozen of Titleist Pro V1 balls. All in playable condition with minimal scuffs. Great for practice.",
                "https://images.unsplash.com/photo-1689732902207-32a8ab8bc5e6?w=600", 5);

        seed(admin, "Cleveland RTX ZipCore Wedge 56°", 89, ProductCondition.VERY_GOOD, ProductCategory.WEDGES,
                "Cleveland", "Miami, FL",
                "Cleveland RTX ZipCore wedge, 56° sand wedge. Great spin and control. Minimal groove wear.",
                "https://images.unsplash.com/photo-1723084574869-12540112a721?w=600", 2);

        seed(admin, "Callaway Mavrik Hybrid 4H", 125, ProductCondition.EXCELLENT, ProductCategory.HYBRIDS,
                "Callaway", "Chicago, IL",
                "Callaway Mavrik 4 Hybrid, 22°. Super easy to hit and launch. Like new condition with headcover.",
                "https://images.unsplash.com/photo-1592459777315-00ab1374a953?w=600", 1);

        seed(admin, "Ping G425 Driver", 299, ProductCondition.VERY_GOOD, ProductCategory.DRIVERS,
                "Ping", "Dallas, TX",
                "Ping G425 Driver, 9° loft, stiff flex. Adjustable hosel. Great condition with minor paint chips on crown.",
                "https://images.unsplash.com/photo-1697448524524-99416ed5dbba?w=600", 1);

        seed(admin, "Odyssey White Hot Putter", 79, ProductCondition.GOOD, ProductCategory.PUTTERS,
                "Odyssey", "Los Angeles, CA",
                "Odyssey White Hot OG Rossie putter, 35 inch. Classic feel with great alignment. Normal wear.",
                "https://images.unsplash.com/photo-1722849899776-3c6abb5a46c7?w=600", 3);

        seed(admin, "Mizuno JPX923 Irons (5-GW)", 649, ProductCondition.EXCELLENT, ProductCategory.IRONS,
                "Mizuno", "Boston, MA",
                "Mizuno JPX923 Hot Metal irons. 5-GW (7 clubs). Graphite shafts, regular flex. Played less than 5 rounds.",
                "https://images.unsplash.com/photo-1761233976530-d09fc58ad175?w=600", 1);

        seed(admin, "Sun Mountain Stand Bag", 149, ProductCondition.EXCELLENT, ProductCategory.BAGS,
                "Sun Mountain", "Portland, OR",
                "Sun Mountain 4.5 LS stand bag. Lightweight with 4-way top. Perfect for walking rounds. Barely used.",
                "https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?w=600", 2);
    }

    private void seed(User seller, String name, int price, ProductCondition condition,
                      ProductCategory category, String brand, String location,
                      String description, String imageUrl, int inventory) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(BigDecimal.valueOf(price));
        p.setCondition(condition);
        p.setCategory(category);
        p.setBrand(brand);
        p.setLocation(location);
        p.setDescription(description);
        p.setImageUrl(imageUrl);
        p.setInventory(inventory);
        p.setSeller(seller);
        productRepository.save(p);
    }
}
