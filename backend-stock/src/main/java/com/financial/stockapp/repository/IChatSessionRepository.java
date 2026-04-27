package com.financial.stockapp.repository;

import com.financial.stockapp.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IChatSessionRepository extends JpaRepository<ChatSession, String> {
}
