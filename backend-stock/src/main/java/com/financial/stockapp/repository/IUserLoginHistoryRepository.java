package com.financial.stockapp.repository;

import com.financial.stockapp.dto.response.LoginHistoryProjection;
import com.financial.stockapp.entity.UserLoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IUserLoginHistoryRepository extends JpaRepository<UserLoginHistory,Integer> {

    List<LoginHistoryProjection> findByUserIdOrderByCreatedAtDesc(int id);
}
