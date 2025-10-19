package net.punked.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import net.punked.backend.model.User; // ✅ Import User
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.exp-ms:86400000}") // default 1 day
    private long expMs;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // --- Generate token from username/email ---
    public String generateToken(String username) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    // --- Overloaded: Generate token from User object ---
    public String generateToken(User user) {
        if (user == null) return null;
        return generateToken(user.getEmail()); // ✅ Now User is recognized
    }

    // --- Extract username from JWT ---
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // --- Validate and return username (alternative, safer) ---
    public String validateAndGetUsername(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token);
            return claims.getBody().getSubject();
        } catch (JwtException e) {
            return null; // invalid or expired token
        }
    }
}
