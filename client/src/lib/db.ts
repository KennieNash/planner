// Simple database stub for development
export const db = {
  user: {
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
  },
  serviceRequest: {
    findMany: async () => [],
    create: async () => null,
  },
  notification: {
    findMany: async () => [],
    create: async () => null,
  },
};

export const prisma = db; 