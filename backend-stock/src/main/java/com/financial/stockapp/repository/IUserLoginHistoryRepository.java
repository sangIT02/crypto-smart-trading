package com.financial.stockapp.repository;

import com.financial.stockapp.repository.projection.LoginHistoryProjection;
import com.financial.stockapp.entity.UserLoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IUserLoginHistoryRepository extends JpaRepository<UserLoginHistory,Integer> {

    Page<LoginHistoryProjection> findByUserIdOrderByCreatedAtDesc(int id, Pageable pageable);
}
