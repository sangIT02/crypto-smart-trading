package com.financial.stockapp.repository;

import com.financial.stockapp.dto.response.TotalOrderTypeResponse;
import com.financial.stockapp.repository.projection.PredictionHistoryResponse;
import com.financial.stockapp.entity.Prediction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface IPredictionRepository extends JpaRepository<Prediction,Long> {

    @Query(value = """
    SELECT 
        current_price as currentPrice,
        predicted_price AS predictedPrice,
        actual_price AS actualPrice,
        signal_ai AS signalAi,
        is_correct AS isCorrect,
        predicted_at AS predictedAt
    FROM predictions
    WHERE user_id = :user_id
    ORDER BY predicted_at DESC
    LIMIT 8""", nativeQuery = true)
    List<PredictionHistoryResponse> getHistory(@Param("user_id") Integer user_id);

    @Query("""
        select new com.financial.stockapp.dto.response.TotalOrderTypeResponse(
            p.signal_ai,
            count(p.id)
        )
        from Prediction p
        group by p.signal_ai
        order by COUNT(p.id) DESC """)
    List<TotalOrderTypeResponse> getTotalOrderType();

    @Query(value = """
        SELECT * FROM predictions p
        WHERE p.is_correct = 0 
        AND p.target_time <= :dateTime 
""", nativeQuery = true)
    List<Prediction> getAllPredictToCatchUp(@Param("dateTime") LocalDateTime dateTime);
}
