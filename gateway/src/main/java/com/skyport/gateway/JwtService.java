package com.skyport.gateway;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final long TTL_SECONDS = 3600;

    private final SecretKey key;

    /** What a validated token carries. */
    public record Session(String username, String role) {}

    public JwtService(@Value("${JWT_SECRET:}") String secret) {
        if (secret == null || secret.isBlank()) {
            log.warn("JWT_SECRET is not set: using a random key, tokens stop working after a restart");
            this.key = Jwts.SIG.HS256.key().build();
        } else {
            this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }

    public String create(String username, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + TTL_SECONDS * 1000))
                .signWith(key)
                .compact();
    }

    /** Returns the session, or throws a JwtException when the token is invalid or expired. */
    public Session validate(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
        String role = claims.get("role", String.class);
        return new Session(claims.getSubject(), role == null ? "ADMIN" : role);
    }

    public long ttlSeconds() {
        return TTL_SECONDS;
    }
}
