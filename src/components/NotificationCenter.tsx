
import React, { useState } from 'react';
import { Bell, Check, CheckCheck, X, MessageSquare, DollarSign, Star, Calendar, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'quote':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'service':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'system':
        return <SettingsIcon className="w-4 h-4 text-gray-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
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
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-white hover:bg-white/20"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0 bg-gray-900/95 border-gray-700" side="bottom" align="end">
        <Card className="border-0 bg-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p>No notifications yet</p>
                  <p className="text-sm">We'll notify you when something happens</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-white/5 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.isRead ? 'bg-white/5' : 'bg-transparent'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className={`font-medium text-sm ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-gray-500 hover:text-gray-300 ml-2"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <>
                <Separator className="bg-gray-700" />
                <div className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full text-blue-400 hover:text-blue-300 hover:bg-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    View All Notifications
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
