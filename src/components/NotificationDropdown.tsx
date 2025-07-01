
import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'verification' | 'booking' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (notificationId: string) => void;
}

const NotificationDropdown = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'verification':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'booking':
        return <Clock className="w-4 h-4 text-green-400" />;
      case 'payment':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'system':
        return <Bell className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    onDelete(notificationId);
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed.",
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-white relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 z-50">
          <Card className="glass-card border-white/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Notifications</CardTitle>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMarkAllAsRead}
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >
                      Mark all as read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No notifications
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 cursor-pointer hover:bg-white/5 border-l-2 ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'bg-white/5' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getNotificationIcon(notification.type, notification.priority)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(e, notification.id)}
                            className="text-gray-400 hover:text-red-400 ml-2"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
