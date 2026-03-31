package com.financial.stockapp.repository;

import com.financial.stockapp.entity.User;
import com.financial.stockapp.repository.custom.CustomUserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<User, Long>, CustomUserRepository {
    User findUserByPhone(String phone);
    User findUserByEmail(String email);

}
