package net.punked.backend.service;

import net.punked.backend.model.Favorite;
import net.punked.backend.model.User;
import net.punked.backend.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    public List<Favorite> findByUser(User user) {
        return favoriteRepository.findByUser(user);
    }
}
