package net.punked.backend.service;

import net.punked.backend.dto.MessageDto;
import net.punked.backend.model.Message;
import net.punked.backend.model.User;
import net.punked.backend.repository.MessageRepository;
import net.punked.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // Send a new message
    public Message sendMessage(User sender, Long receiverId, String content, String productName, String type, String status) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        Message message = new Message(sender, receiver, content, productName, type, status);
        return messageRepository.save(message);
    }

    // Get all messages for a user's inbox
    public List<MessageDto> getInbox(User user) {
        List<Message> messages = messageRepository.findByReceiverOrderBySentAtDesc(user);
        return messages.stream().map(this::toDto).collect(Collectors.toList());
    }

    // Get a conversation thread between sender and receiver
    public List<Message> getThread(Long messageId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        return messageRepository.findBySenderAndReceiverOrReceiverAndSenderOrderBySentAtAsc(
                msg.getSender(), msg.getReceiver(),
                msg.getSender(), msg.getReceiver()
        );
    }

    // Approve a sale associated with a message
    public Message approveSale(Long messageId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        msg.setStatus("approved");
        return messageRepository.save(msg);
    }

    // Delete a message by its ID
    public void deleteMessage(Long messageId) {
        if (!messageRepository.existsById(messageId)) {
            throw new RuntimeException("Message not found");
        }
        messageRepository.deleteById(messageId);
    }

    // Convert Message entity to MessageDto
    private MessageDto toDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setContent(message.getContent());
        dto.setProductName(message.getProductName());
        dto.setType(message.getType());
        dto.setStatus(message.getStatus());
        dto.setSenderUsername(message.getSender().getUsername());
        dto.setSenderAvatar(message.getSender().getAvatarUrl()); // make sure User.java has getAvatarUrl()
        return dto;
    }
}
