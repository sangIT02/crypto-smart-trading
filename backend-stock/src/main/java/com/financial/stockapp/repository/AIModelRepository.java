package com.financial.stockapp.repository;

import com.financial.stockapp.dto.response.AIModelResponse;
import com.financial.stockapp.entity.AiModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AIModelRepository extends JpaRepository<AiModel,Long> {

    @Query(value = """
        select count(*)
        from ai_models ai
        where 1 = 1
""", nativeQuery = true)
    int getTotalAIModel();

    @Query(value = """
        select count(*)
        from ai_models ai
        where ai.is_active = 1
""", nativeQuery = true)
    int getTotalAIModelActive();

    @Query(value = """
        select * from ai_models ai
        where ai.status = :status
""", nativeQuery = true)
    List<AiModel> getAIModelByStatus(@Param("status")String status);

    @Query(
            value = """
            SELECT 
                id AS id, 
                model_name AS modelName, 
                mae AS mae, 
                rmse AS rmse, 
                direction_acc AS directionAcc, 
                trained_at AS trainedAt, 
                is_active AS isActive 
            FROM ai_models 
        """,
            countQuery = "SELECT COUNT(*) FROM ai_models", // BẮT BUỘC để tính tổng số trang
            nativeQuery = true
    )
    Page<AIModelResponse> getModels(Pageable pageable);
}
