import { PrismaClient } from '@prisma/client'
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Log para comprobar la conexión a la base de datos
async function testDbConnection() {
  try {
    await prisma.$connect();
    logger.info('[DB] Conexión a la base de datos exitosa', 'Prisma');
  } catch (error) {
    logger.error('[DB] Error de conexión a la base de datos:', 'Prisma', error);
  }
}

testDbConnection(); 