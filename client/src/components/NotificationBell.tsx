import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export function NotificationBell() {
  const { user } = useAuth();

  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getUserNotifications(user?.id || ""),
    enabled: !!user,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: () => notificationService.getUnreadCount(user?.id || ""),
    enabled: !!user,
  });

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    refetch();
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => notificationService.markAllAsRead(user.id)}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications?.notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications?.notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 cursor-pointer"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Badge variant="secondary" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between w-full mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {notification.actionUrl && (
                    <Link
                      to={notification.actionUrl}
                      className="text-xs text-primary hover:underline"
                    >
                      View details
                    </Link>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Link
            to="/notifications"
            className="text-sm text-primary hover:underline w-full text-center block"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 