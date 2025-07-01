import { prisma } from '@/lib/db';
import { Message, MessageType, MessageStatus } from '@prisma/client';

export interface CreateMessageInput {
  threadId: string;
  senderId: string;
  content: string;
  type?: MessageType;
  attachmentUrl?: string;
}

export const messageService = {
  // Create a new message
  async createMessage(data: CreateMessageInput): Promise<Message> {
    return prisma.message.create({
      data: {
        ...data,
        type: data.type || 'TEXT',
        status: 'SENT',
      },
      include: {
        sender: true,
        thread: {
          include: {
            serviceRequest: true,
          },
        },
      },
    });
  },

  // Get message by ID
  async getMessageById(id: string): Promise<Message | null> {
    return prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        thread: {
          include: {
            serviceRequest: true,
          },
        },
      },
    });
  },

  // Get messages in a thread
  async getThreadMessages(threadId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { threadId },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          sender: true,
        },
      }),
      prisma.message.count({ where: { threadId } }),
    ]);

    return {
      messages,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Update message status
  async updateMessageStatus(id: string, status: MessageStatus): Promise<Message> {
    return prisma.message.update({
      where: { id },
      data: { status },
      include: {
        sender: true,
        thread: {
          include: {
            serviceRequest: true,
          },
        },
      },
    });
  },

  // Mark messages as read
  async markMessagesAsRead(threadId: string, userId: string): Promise<void> {
    await prisma.message.updateMany({
      where: {
        threadId,
        senderId: { not: userId },
        status: { not: 'READ' },
      },
      data: { status: 'READ' },
    });
  },

  // Get or create message thread for a service request
  async getOrCreateThread(serviceRequestId: string) {
    const existingThread = await prisma.messageThread.findUnique({
      where: { serviceRequestId },
      include: {
        messages: {
          include: {
            sender: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (existingThread) {
      return existingThread;
    }

    return prisma.messageThread.create({
      data: {
        serviceRequestId,
      },
      include: {
        messages: {
          include: {
            sender: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  // Delete message
  async deleteMessage(id: string): Promise<Message> {
    return prisma.message.delete({
      where: { id },
    });
  },
}; 