// contexts/NotificationContext.tsx
import React, { createContext, useState, useEffect, useContext, useRef, type ReactNode } from 'react';
import type { AppNotification, NotificationContextType } from '../types/notification';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
interface Props {
    children: ReactNode;
    userId: number | null;
}

export const NotificationProvider: React.FC<Props> = ({ children, userId }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!userId) return;

        // Khởi tạo STOMP Client
        const client = new Client({
          webSocketFactory: () => new SockJS('https://crypto-smart-trading.onrender.com/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('STOMP: Connected');
            
            // Đăng ký nhận tin
            client.subscribe(`/topic/user/${userId}/notifications`, (message: IMessage) => {
              console.log("Raw message body:", message.body); // <-- THÊM DÒNG NÀY ĐỂ DEBUG
                if (message.body) {
                    const newNotif: AppNotification = JSON.parse(message.body);
                    
                    setNotifications((prev) => [newNotif, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                    
                    console.log('New message received:', newNotif.title);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP Error:', frame.headers['message']);
        };

        client.activate();
        stompClientRef.current = client;

        // Cleanup khi unmount
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                console.log('STOMP: Deactivated');
            }
        };
    }, [userId]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, setUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook có check undefined để đảm bảo an toàn trong TS
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
