package com.licenta.domain.repository;

import com.licenta.domain.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ChatMessageJPARepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByChatId(String s, Pageable pageable);
    ChatMessage findFirstByChatIdOrderByTimestampDesc(String chatId);
    List<ChatMessage> findAllByChatIdAndIsReadIsFalse(String chatId);
    Long countAllByRecipientIdAndIsReadIsFalse(Long recipientId);
}
