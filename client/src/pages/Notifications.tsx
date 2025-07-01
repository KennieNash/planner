import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationType } from "@prisma/client";

export default function Notifications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all");

  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications", activeTab],
    queryFn: () =>
      activeTab === "all"
        ? notificationService.getUserNotifications(user?.id || "")
        : notificationService.getNotificationsByType(user?.id || "", activeTab),
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["notificationStats"],
    queryFn: () => notificationService.getNotificationStats(user?.id || ""),
    enabled: !!user,
  });

  const handleMarkAllAsRead = async () => {
    if (user) {
      await notificationService.markAllAsRead(user.id);
      refetch();
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications?.notifications.some((n) => !n.isRead) && (
          <Button onClick={handleMarkAllAsRead}>Mark all as read</Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
          <p className="text-2xl font-bold">{stats?.total || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Unread</h3>
          <p className="text-2xl font-bold">{stats?.unread || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">High Priority</h3>
          <p className="text-2xl font-bold">{stats?.priorityStats?.HIGH || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Today</h3>
          <p className="text-2xl font-bold">
            {notifications?.notifications.filter(
              (n) =>
                new Date(n.createdAt).toDateString() ===
                new Date().toDateString()
            ).length || 0}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="SYSTEM">System</TabsTrigger>
          <TabsTrigger value="SERVICE_REQUEST">Service Requests</TabsTrigger>
          <TabsTrigger value="PAYMENT">Payments</TabsTrigger>
          <TabsTrigger value="MESSAGE">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {notifications?.notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications found
            </div>
          ) : (
            <div className="space-y-4">
              {notifications?.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    !notification.isRead ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {notification.type.toLowerCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <Link
                        to={notification.actionUrl}
                        className="text-sm text-primary hover:underline"
                      >
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 