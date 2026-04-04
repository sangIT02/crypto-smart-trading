package com.financial.stockapp.repository;

import com.financial.stockapp.entity.User;
import com.financial.stockapp.repository.custom.CustomUserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<User, Integer>, CustomUserRepository {
    User findUserByEmail(String email);

}
