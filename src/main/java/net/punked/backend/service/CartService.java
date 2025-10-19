package net.punked.backend.service;

import net.punked.backend.dto.CartItemDto;
import net.punked.backend.model.CartItem;
import net.punked.backend.model.User;
import net.punked.backend.repository.CartItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartItemRepository cartRepo;

    public CartService(CartItemRepository cartRepo) {
        this.cartRepo = cartRepo;
    }

    public List<CartItemDto> getCart(User user) {
        return cartRepo.findByUser(user).stream()
                .map(item -> new CartItemDto(item.getName(), item.getPrice(), item.getQty()))
                .collect(Collectors.toList());
    }

    public void saveCart(User user, List<CartItemDto> items) {
        cartRepo.deleteByUser(user); // clear old cart
        List<CartItem> newItems = items.stream()
                .map(dto -> new CartItem(dto.getName(), dto.getPrice(), dto.getQty(), user))
                .collect(Collectors.toList());
        cartRepo.saveAll(newItems);
    }

    public void clearCart(User user) {
        cartRepo.deleteByUser(user);
    }
}
