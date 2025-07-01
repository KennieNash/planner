const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = await bcrypt.hash('yourStrongPassword', 10);
  const admin = await prisma.user.create({
    data: {
      email,
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', admin);
}

main().catch(console.error).finally(() => prisma.$disconnect());