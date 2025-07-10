import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Log para comprobar la conexión a la base de datos
async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log('[DB] Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('[DB] Error de conexión a la base de datos:', error);
  }
}

testDbConnection(); 