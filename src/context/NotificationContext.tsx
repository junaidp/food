import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { getSocket } from '../lib/socket';
import { useAuth } from './AuthContext';
import type { Notification } from '../../shared/types';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  toasts: Toast[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((title: string, message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const [nRes, cRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/unread-count'),
      ]);
      setNotifications(nRes.data.data);
      setUnreadCount(cRes.data.data.count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  // Listen for socket events
  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    const socket = getSocket();
    if (socket) {
      socket.on('new_claim', (data: any) => {
        addToast('🔔 New Request', `${data.receiver_name} wants food from "${data.listing_title}"`, 'info');
        fetchNotifications();
      });
      socket.on('claim_accepted', (data: any) => {
        addToast('✅ Request Accepted!', `Your pickup code: ${data.pickup_code}`, 'success');
        fetchNotifications();
      });
      socket.on('claim_rejected', () => {
        addToast('Request Update', 'Your food request was not accepted.', 'error');
        fetchNotifications();
      });
      socket.on('receiver_arrived', (data: any) => {
        addToast('📍 Receiver Arrived!', `${data.receiver_name} is at your location`, 'info');
        fetchNotifications();
      });
      socket.on('pickup_confirmed', () => {
        addToast('🎉 Pickup Confirmed!', 'Enjoy your meal!', 'success');
        fetchNotifications();
      });
    }

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('new_claim');
        socket.off('claim_accepted');
        socket.off('claim_rejected');
        socket.off('receiver_arrived');
        socket.off('pickup_confirmed');
      }
    };
  }, [user, fetchNotifications, addToast]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, toasts, fetchNotifications, markAsRead, markAllAsRead, addToast, removeToast }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
}
