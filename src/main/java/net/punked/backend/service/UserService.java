package net.punked.backend.service;

import net.punked.backend.model.User;
import net.punked.backend.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired; // for UserRepository
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Autowired
    public UserService(@Lazy PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    // --- Registration ---
    public User register(String username, String email, String rawPassword) {
        String hash = passwordEncoder.encode(rawPassword);
        User user = new User(username, email, hash);
        return userRepository.save(user);
    }

    // --- Authentication (Spring Security) ---
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    // --- Finders ---
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // --- Get User from Token ---
    public User getUserFromToken(String token) {
        if (token == null || token.isEmpty()) return null;
        String email = token; // placeholder logic
        return findByEmail(email);
    }

    // --- Check password utility for login ---
    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPasswordHash());
    }

    // --- Profile Updates ---
    public User updateProfile(Long userId, User updatedData) {
        User existing = findById(userId);
        if (existing == null) return null;

        if (updatedData.getUsername() != null) existing.setUsername(updatedData.getUsername());
        if (updatedData.getFirstName() != null) existing.setFirstName(updatedData.getFirstName());
        if (updatedData.getLastName() != null) existing.setLastName(updatedData.getLastName());
        if (updatedData.getBio() != null) existing.setBio(updatedData.getBio());
        if (updatedData.getCountry() != null) existing.setCountry(updatedData.getCountry());
        if (updatedData.getPaymentDetails() != null) existing.setPaymentDetails(updatedData.getPaymentDetails());
        if (updatedData.getAvatar() != null) existing.setAvatar(updatedData.getAvatar());

        return userRepository.save(existing);
    }

    // --- Change Password ---
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<User> opt = userRepository.findById(userId);
        if (opt.isEmpty()) return false;

        User user = opt.get();
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            return false;
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    // --- Update Avatar Only ---
    public User updateAvatar(Long userId, String avatarBase64) {
        User user = findById(userId);
        if (user == null) return null;
        user.setAvatar(avatarBase64);
        return userRepository.save(user);
    }

    // --- Delete Account ---
    public boolean deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) return false;
        userRepository.deleteById(userId);
        return true;
    }
}
