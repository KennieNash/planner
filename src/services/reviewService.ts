import { prisma } from '@/lib/db';
import { Review } from '@prisma/client';

export interface CreateReviewInput {
  serviceRequestId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  // Create a new review
  async createReview(data: CreateReviewInput): Promise<Review> {
    const review = await prisma.review.create({
      data,
      include: {
        customer: true,
        provider: true,
      },
    });

    // Update provider's average rating
    await this.updateProviderRating(data.providerId);

    return review;
  },

  // Get review by ID
  async getReviewById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
      include: {
        customer: true,
        provider: true,
      },
    });
  },

  // Update review
  async updateReview(id: string, data: Partial<CreateReviewInput>): Promise<Review> {
    const review = await prisma.review.update({
      where: { id },
      data,
      include: {
        customer: true,
        provider: true,
      },
    });

    if (data.providerId) {
      await this.updateProviderRating(data.providerId);
    }

    return review;
  },

  // Delete review
  async deleteReview(id: string): Promise<Review> {
    const review = await prisma.review.delete({
      where: { id },
      include: {
        provider: true,
      },
    });

    await this.updateProviderRating(review.providerId);

    return review;
  },

  // Get reviews by provider
  async getProviderReviews(providerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { providerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
        },
      }),
      prisma.review.count({ where: { providerId } }),
    ]);

    return {
      reviews,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Get reviews by customer
  async getCustomerReviews(customerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: true,
        },
      }),
      prisma.review.count({ where: { customerId } }),
    ]);

    return {
      reviews,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Update provider's average rating
  private async updateProviderRating(providerId: string): Promise<void> {
    const reviews = await prisma.review.findMany({
      where: { providerId },
      select: { rating: true },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        rating: averageRating,
        totalReviews: reviews.length,
      },
    });
  },

  // Get review statistics
  async getReviewStats(providerId: string) {
    const reviews = await prisma.review.findMany({
      where: { providerId },
      select: { rating: true },
    });

    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    const distribution = reviews.reduce((dist, r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    return {
      total,
      average,
      distribution,
    };
  },
}; 