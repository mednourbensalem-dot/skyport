package com.skyport.gateway;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {
    private final JwtService jwt = new JwtService("skyport-test-secret-0123456789-abcdefghij");

    @Test
    void roundTripsUsernameAndRole() {
        String token = jwt.create("admin", "ADMIN");

        JwtService.Session session = jwt.validate(token);

        assertEquals("admin", session.username());
        assertEquals("ADMIN", session.role());
    }

    @Test
    void rejectsTamperedToken() {
        String token = jwt.create("admin", "ADMIN");

        assertThrows(JwtException.class, () -> jwt.validate(token + "x"));
    }
}
