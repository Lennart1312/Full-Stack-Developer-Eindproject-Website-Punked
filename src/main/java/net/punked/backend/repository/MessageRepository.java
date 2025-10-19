package net.punked.backend.repository;

import net.punked.backend.model.Message;
import net.punked.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Get all messages received by a user, most recent first
    List<Message> findByReceiverOrderBySentAtDesc(User receiver);

    // Get the full conversation thread between two users, ordered chronologically
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderBySentAtAsc(
            User sender1, User receiver1, User sender2, User receiver2
    );
}
