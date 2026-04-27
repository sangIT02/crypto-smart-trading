package com.financial.stockapp.component;

import com.financial.stockapp.entity.ChatMessage;
import com.financial.stockapp.entity.ChatSession;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.repository.IChatMessageRepository;
import com.financial.stockapp.repository.IChatSessionRepository;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseChatMemory implements ChatMemory {
    private final IChatMessageRepository messageRepository;
    private final IChatSessionRepository sessionRepository;
    private final IUserRepository userRepository;


    @Override
    public void add(String conversationId, List<Message> messages) {
        int user_id = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(user_id);
        ChatSession session = sessionRepository.findById(conversationId)
                .orElseGet(() -> {
                    ChatSession newSession = new ChatSession();
                    newSession.setId(conversationId);
                    newSession.setCreatedAt(LocalDateTime.now());
                    newSession.setUser(user);
                    // Nếu bạn có thông tin User từ SecurityContext, hãy set vào đây
                    return sessionRepository.save(newSession);
                });

        for(Message msg : messages){
            ChatMessage messageEntity = new ChatMessage();
            messageEntity.setSession(session);
            messageEntity.setContent(msg.getText());
            if (msg instanceof UserMessage) {
                messageEntity.setRole("USER");
            } else if (msg instanceof AssistantMessage) {
                messageEntity.setRole("ASSISTANT");
            }

            messageRepository.save(messageEntity);
        }

    }

    @Override
    public List<Message> get(String conversationId) {
        List<ChatMessage> dbMessage = messageRepository.findTopBySessionIdOrderByCreatedAtDesc(conversationId);
        List<Message> springMessage = new ArrayList<>();
        for(ChatMessage msg : dbMessage){
            if ("USER".equals(msg.getRole())) {
                springMessage.add(new UserMessage(msg.getContent()));
            } else {
                springMessage.add(new AssistantMessage(msg.getContent()));
            }
        }
        Collections.reverse(springMessage);
        return springMessage;
    }

    @Override
    public void clear(String conversationId) {
        messageRepository.deleteBySessionId(conversationId);
    }
}
