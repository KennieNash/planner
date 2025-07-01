import { prisma } from '@/lib/db';
import { ServiceRequest, RequestStatus, Priority } from '@prisma/client';

export interface CreateServiceRequestInput {
  customerId: string;
  serviceId: string;
  title: string;
  description: string;
  priority: Priority;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  preferredDate?: Date;
  preferredTime?: string;
  budgetRange?: string;
  additionalNotes?: string;
}

export interface UpdateServiceRequestInput {
  title?: string;
  description?: string;
  status?: RequestStatus;
  priority?: Priority;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  preferredDate?: Date;
  preferredTime?: string;
  budgetRange?: string;
  additionalNotes?: string;
}

export const serviceRequestService = {
  // Create a new service request
  async createServiceRequest(data: CreateServiceRequestInput): Promise<ServiceRequest> {
    return prisma.serviceRequest.create({
      data,
      include: {
        customer: true,
        service: true,
      },
    });
  },

  // Get service request by ID
  async getServiceRequestById(id: string): Promise<ServiceRequest | null> {
    return prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        quotes: true,
        messages: true,
        payments: true,
        job: true,
      },
    });
  },

  // Update service request
  async updateServiceRequest(id: string, data: UpdateServiceRequestInput): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data,
      include: {
        customer: true,
        service: true,
      },
    });
  },

  // Delete service request
  async deleteServiceRequest(id: string): Promise<ServiceRequest> {
    return prisma.serviceRequest.delete({
      where: { id },
    });
  },

  // List service requests (with pagination and filters)
  async listServiceRequests({
    page = 1,
    limit = 10,
    status,
    priority,
    customerId,
    serviceId,
  }: {
    page?: number;
    limit?: number;
    status?: RequestStatus;
    priority?: Priority;
    customerId?: string;
    serviceId?: string;
  }) {
    const skip = (page - 1) * limit;
    
    const where = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(customerId && { customerId }),
      ...(serviceId && { serviceId }),
    };

    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          service: true,
        },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    return {
      requests,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Update service request status
  async updateStatus(id: string, status: RequestStatus): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        service: true,
      },
    });
  },

  // Get service requests by customer
  async getCustomerServiceRequests(customerId: string, page = 1, limit = 10) {
    return this.listServiceRequests({
      page,
      limit,
      customerId,
    });
  },

  // Get service requests by service
  async getServiceRequestsByService(serviceId: string, page = 1, limit = 10) {
    return this.listServiceRequests({
      page,
      limit,
      serviceId,
    });
  },
}; 