package com.skyport.gateway;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(String username, String password) {}

    private final AuthenticationManager authManager;
    private final JwtService jwt;

    public AuthController(AuthenticationManager authManager, JwtService jwt) {
        this.authManager = authManager;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.username() == null || req.username().isBlank()
                || req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required."));
        }
        Authentication auth;
        try {
            auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username(), req.password()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password."));
        }
        return ResponseEntity.ok(token(auth.getName(), role(auth)));
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("username", auth.getName());
        out.put("role", role(auth));
        return out;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(Authentication auth) {
        if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(token(auth.getName(), role(auth)));
    }

    private Map<String, Object> token(String username, String role) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("token", jwt.create(username, role));
        out.put("username", username);
        out.put("role", role);
        out.put("expiresIn", jwt.ttlSeconds());
        return out;
    }

    private static String role(Authentication auth) {
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(a -> a.replace("ROLE_", ""))
                .findFirst().orElse("USER");
    }
}
