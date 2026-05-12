// types/notification.ts
export interface AppNotification {
    id: number;
    userId: number;
    campaignId: number;
    title: string;
    content: string;
    type: string; // e.g., 'SYSTEM', 'PROMOTION'
    isRead: boolean;
    createdAt: string; // ISO Date string
}

export interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}