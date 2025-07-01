import { prisma } from '@/lib/db';
import { User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isVerified?: boolean;
  mfaEnabled?: boolean;
}

export const userService = {
  // Create a new user
  async createUser(data: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // Update user
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  // Delete user
  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },

  // Verify password
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  },

  // List users (with pagination)
  async listUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },
}; 