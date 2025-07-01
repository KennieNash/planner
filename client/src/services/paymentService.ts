import { prisma } from '@/lib/db';
import { Payment, PaymentMethod, PaymentStatus } from '@prisma/client';

export interface CreatePaymentInput {
  serviceRequestId: string;
  quoteId?: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
}

export const paymentService = {
  // Create a new payment
  async createPayment(data: CreatePaymentInput): Promise<Payment> {
    return prisma.payment.create({
      data: {
        ...data,
        status: 'PENDING',
      },
      include: {
        serviceRequest: true,
        quote: true,
        customer: true,
      },
    });
  },

  // Get payment by ID
  async getPaymentById(id: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        serviceRequest: true,
        quote: true,
        customer: true,
      },
    });
  },

  // Update payment status
  async updatePaymentStatus(id: string, status: PaymentStatus, transactionId?: string): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: {
        status,
        ...(transactionId && { transactionId }),
      },
      include: {
        serviceRequest: true,
        quote: true,
        customer: true,
      },
    });
  },

  // Get payments by customer
  async getCustomerPayments(customerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          serviceRequest: true,
          quote: true,
        },
      }),
      prisma.payment.count({ where: { customerId } }),
    ]);

      return {
      payments,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Get payments by service request
  async getServiceRequestPayments(serviceRequestId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { serviceRequestId },
      include: {
        quote: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Process payment (mock implementation)
  async processPayment(paymentId: string): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Mock payment processing
    const success = Math.random() > 0.1; // 90% success rate for demo
    const status: PaymentStatus = success ? 'COMPLETED' : 'FAILED';
    const transactionId = success ? `txn_${Date.now()}` : undefined;

    return this.updatePaymentStatus(paymentId, status, transactionId);
  },

  // Refund payment
  async refundPayment(paymentId: string): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      throw new Error('Only completed payments can be refunded');
    }

    return this.updatePaymentStatus(paymentId, 'REFUNDED');
  },

  // Get payment statistics
  async getPaymentStats(customerId: string) {
    const payments = await prisma.payment.findMany({
      where: { customerId },
      select: {
        amount: true,
        status: true,
        method: true,
      },
    });

    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const completed = payments.filter(p => p.status === 'COMPLETED').length;
    const failed = payments.filter(p => p.status === 'FAILED').length;
    const refunded = payments.filter(p => p.status === 'REFUNDED').length;

    const methodStats = payments.reduce((stats, p) => {
      stats[p.method] = (stats[p.method] || 0) + 1;
      return stats;
    }, {} as Record<PaymentMethod, number>);

      return {
      total,
      count: payments.length,
      completed,
      failed,
      refunded,
      methodStats,
    };
  },
}; 