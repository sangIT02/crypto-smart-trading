package com.financial.stockapp.repository;

import com.financial.stockapp.entity.Order;
import com.financial.stockapp.repository.projection.SymbolOrderProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IOrderRepository extends JpaRepository<Order, Integer> {

    @Query(value = """
        SELECT
            CONCAT(c.symbol, '/USDT') AS symbol,
            COUNT(*) AS totalOrders
            FROM orders o 
            JOIN coins c ON c.id = o.coin_id
            GROUP BY c.trading_pair
            ORDER BY totalOrders DESC
            LIMIT 5;
""", nativeQuery = true)
    List<SymbolOrderProjection> getSymbolTotalOrder();

    @Query(value = """
        select count(*)
        from orders
""", nativeQuery = true)
    Long getTotalOrders();
}
