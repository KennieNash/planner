
import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'verification' | 'booking' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const useNotifications = () => {
  // Mock notifications - in real app this would come from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'verification',
      title: 'New Document Submitted',
      message: 'John Smith Plumbing submitted a business license for review.',
      timestamp: '2 minutes ago',
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'verification',
      title: 'Document Requires Action',
      message: 'Sarah Johnson Electrical\'s insurance certificate needs review.',
      timestamp: '15 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'booking',
      title: 'New Booking Request',
      message: 'Customer requested HVAC service for tomorrow.',
      timestamp: '1 hour ago',
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Processing Issue',
      message: 'Payment for booking #12345 requires attention.',
      timestamp: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: '5',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM.',
      timestamp: '3 hours ago',
      read: true,
      priority: 'low'
    }
  ]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: 'Just now',
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  };
};
