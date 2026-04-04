package com.financial.stockapp.repository;

import com.financial.stockapp.dto.request.GetAPIKeyDTO;
import com.financial.stockapp.dto.response.ApiKeyResponse;
import com.financial.stockapp.dto.response.GetKeyProjection;
import com.financial.stockapp.entity.BinanceAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IBinanceAccountRepository extends JpaRepository<BinanceAccount,Integer> {
    List<BinanceAccount> findAll();

    @Query(value = """
    SELECT 
        id AS id,
        api_key AS apiKey,
        secret_key AS secretKey,
        name_account AS nameAccount,
        created_at AS createdAt,
        is_active AS isActive
    FROM binance_accounts
    WHERE user_id = :id
    """, nativeQuery = true)
    GetKeyProjection findBinanceAccountByIdNative(@Param("id") int id);


    @Query(value = """
    SELECT 
        api_key as apiKey,
        secret_key as secretKey
    FROM binance_accounts
    WHERE user_id = :id
""", nativeQuery = true)
    GetAPIKeyDTO getByUserId(@Param("id")int id);
}
