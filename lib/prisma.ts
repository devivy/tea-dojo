import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAdapter: PrismaLibSql | undefined;
};

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

// Create the libSQL adapter - pass URL directly to adapter
const adapter =
  globalForPrisma.prismaAdapter ??
  new PrismaLibSql({
    url: databaseUrl,
  });

// Create Prisma client with the adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// In development, save instances globally
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaAdapter = adapter;
}
