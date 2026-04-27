package com.financial.stockapp.repository;

import com.financial.stockapp.dto.response.TotalUserProjection;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.repository.custom.CustomUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface IUserRepository extends JpaRepository<User, Integer>, CustomUserRepository {
    User findUserByEmail(String email);

    User findById(long id);

    @Query(value = """
    select count(*)
    from users as u
    where u.role_id = 2
""", nativeQuery = true)
    long countTotalUser();

    @Query(value = """
    select count(*)
    from users as u
    where u.role_id = 2 and u.is_active = 1
""", nativeQuery = true)
    long countActiveUser();

    @Query(value = """
    select u.id as id,
           u.full_name as fullName,
           u.email as email,
           u.is_active as isActive, 
           u.created_at as createdAt, 
           count(o.id) as totalOrder
    from users u
    left join orders o on u.id = o.user_id
    WHERE u.role_id = 2 
    GROUP BY u.id;
""",countQuery = "SELECT COUNT(id) FROM users WHERE role_id = 2", nativeQuery = true)
    Page<TotalUserProjection> getAllUser(Pageable pageable);


}
