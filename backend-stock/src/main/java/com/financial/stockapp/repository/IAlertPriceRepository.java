package com.financial.stockapp.repository;

import com.financial.stockapp.repository.projection.AlertPriceProjection;
import com.financial.stockapp.entity.AlertPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IAlertPriceRepository extends JpaRepository<AlertPrice,Long> {

    List<AlertPrice> findAlertPricesByUserId(long userId);
    List<AlertPriceProjection> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}
