package net.punked.backend.controller;

import net.punked.backend.dto.MessageDto;
import net.punked.backend.model.Message;
import net.punked.backend.model.User;
import net.punked.backend.service.MessageService;
import net.punked.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    // Send a new message
    @PostMapping
    public Message send(@RequestBody MessageDto dto, Principal principal) {
        User sender = userService.findByUsername(principal.getName());
        return messageService.sendMessage(
                sender,
                dto.getReceiverId(),
                dto.getContent(),
                dto.getProductName(),
                dto.getType(),
                dto.getStatus()
        );
    }

    // Get inbox messages for the logged-in user
    @GetMapping("/inbox")
    public List<MessageDto> inbox(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return messageService.getInbox(user);
    }

    // Get full conversation thread by message ID
    @GetMapping("/thread/{id}")
    public List<Message> getThread(@PathVariable Long id) {
        return messageService.getThread(id);
    }

    // Approve a sale for a message
    @PutMapping("/approve/{id}")
    public Message approveSale(@PathVariable Long id) {
        return messageService.approveSale(id);
    }

    // Delete a message by ID
    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
    }
}
