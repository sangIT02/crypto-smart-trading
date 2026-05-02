package com.financial.stockapp.repository;

import com.financial.stockapp.dto.response.TotalOrderTypeResponse;
import com.financial.stockapp.repository.projection.PredictionHistoryResponse;
import com.financial.stockapp.entity.Prediction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IPredictionRepository extends JpaRepository<Prediction,Long> {

    @Query(value = """
    SELECT 
        predicted_price AS predictedPrice,
        actual_price AS actualPrice,
        signal_ai AS signalAi,
        is_correct AS isCorrect,
        predicted_at AS predictedAt
    FROM predictions
    WHERE coin_id = :coinId
    ORDER BY predicted_at DESC
""",
            countQuery = """
    SELECT COUNT(*) FROM predictions WHERE coin_id = :coinId
""",
            nativeQuery = true)
    Page<PredictionHistoryResponse> getHistory(
            @Param("coinId") Integer coinId,
            Pageable pageable
    );

    @Query("""
        select new com.financial.stockapp.dto.response.TotalOrderTypeResponse(
            p.signal_ai,
            count(p.id)
        )
        from Prediction p
        group by p.signal_ai
        order by COUNT(p.id) DESC
""")
    List<TotalOrderTypeResponse> getTotalOrderType();
}
