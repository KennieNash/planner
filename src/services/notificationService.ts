import { prisma } from '@/lib/db';
import { Notification, NotificationType, Priority } from '@prisma/client';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: Priority;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export const notificationService = {
  // Create a new notification
  async createNotification(data: CreateNotificationInput): Promise<Notification> {
    return prisma.notification.create({
      data: {
        ...data,
        priority: data.priority || 'MEDIUM',
        isRead: false,
      },
      include: {
        user: true,
      },
    });
  },

  // Get notification by ID
  async getNotificationById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
      include: {
        user: true,
      },
    });
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  },

  // Delete notification
  async deleteNotification(id: string): Promise<Notification> {
    return prisma.notification.delete({
      where: { id },
    });
  },

  // Get user notifications
  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Get unread notifications count
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  },

  // Create multiple notifications
  async createNotifications(notifications: CreateNotificationInput[]): Promise<Notification[]> {
    return prisma.notification.createMany({
      data: notifications.map(n => ({
        ...n,
        priority: n.priority || 'MEDIUM',
        isRead: false,
      })),
    }).then(() => 
      prisma.notification.findMany({
        where: {
          userId: notifications[0].userId,
        },
        orderBy: { createdAt: 'desc' },
        take: notifications.length,
      })
    );
  },

  // Get notifications by type
  async getNotificationsByType(userId: string, type: NotificationType, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
          type,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({
        where: {
          userId,
          type,
        },
      }),
    ]);

    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Get notification statistics
  async getNotificationStats(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      select: {
        type: true,
        isRead: true,
        priority: true,
      },
    });

    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const typeStats = notifications.reduce((stats, n) => {
      stats[n.type] = (stats[n.type] || 0) + 1;
      return stats;
    }, {} as Record<NotificationType, number>);

    const priorityStats = notifications.reduce((stats, n) => {
      stats[n.priority] = (stats[n.priority] || 0) + 1;
      return stats;
    }, {} as Record<Priority, number>);

    return {
      total,
      unread,
      typeStats,
      priorityStats,
    };
  },
}; 