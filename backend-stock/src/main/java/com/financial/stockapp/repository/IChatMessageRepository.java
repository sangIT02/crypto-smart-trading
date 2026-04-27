package com.financial.stockapp.repository;

import com.financial.stockapp.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IChatMessageRepository extends JpaRepository<ChatMessage,Long> {

    @Query(value = """
        SELECT * FROM chat_messages as cm
        WHERE cm.session_id = :sessionId
        ORDER BY cm.created_at DESC
        LIMIT 20
""", nativeQuery = true)
    List<ChatMessage> findTopBySessionIdOrderByCreatedAtDesc(@Param("sessionId") String sessionId);

    void deleteBySessionId(String sessionId);
}
