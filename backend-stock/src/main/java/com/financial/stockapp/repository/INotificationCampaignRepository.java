package com.financial.stockapp.repository;

import com.financial.stockapp.entity.NotificationCampaign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface INotificationCampaignRepository extends JpaRepository<NotificationCampaign, Long> {
}
