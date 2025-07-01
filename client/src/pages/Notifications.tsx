import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NotificationType = "SYSTEM" | "SERVICE_REQUEST" | "PAYMENT" | "MESSAGE";

export default function Notifications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all");

  // Mock data for notifications
  const notifications = {
    notifications: [
      {
        id: "1",
        title: "Service Request Update",
        message: "Your plumbing request has been accepted",
        createdAt: new Date().toISOString(),
        isRead: false,
        type: "SERVICE_REQUEST" as NotificationType,
        priority: "HIGH" as const
      },
      {
        id: "2", 
        title: "Payment Confirmed",
        message: "Payment of $150 has been processed",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        type: "PAYMENT" as NotificationType,
        priority: "MEDIUM" as const
      }
    ]
  };

  const stats = {
    total: 15,
    unread: 3,
    priorityStats: { HIGH: 1, MEDIUM: 5, LOW: 9 }
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
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