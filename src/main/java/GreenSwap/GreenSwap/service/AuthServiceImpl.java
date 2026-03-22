package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.dto.request.LoginRequest;
import GreenSwap.GreenSwap.dto.request.RegisterRequest;
import GreenSwap.GreenSwap.dto.response.AuthResponse;
import GreenSwap.GreenSwap.enums.Role;
import GreenSwap.GreenSwap.model.User;
import GreenSwap.GreenSwap.repository.UserRepository;
import GreenSwap.GreenSwap.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.from(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));
        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.from(token, user);
    }
}
