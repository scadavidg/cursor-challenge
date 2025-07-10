import { prisma } from "../db/prisma";
import { User } from "../../domain/entities/User";

// Helper function to convert Prisma User to domain User
function mapPrismaUserToDomainUser(prismaUser: any): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name || undefined,
    email: prismaUser.email,
    password: prismaUser.password || undefined,
    image: prismaUser.image || undefined,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    provider: prismaUser.provider || undefined,
    providerAccountId: prismaUser.providerAccountId || undefined,
  };
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { email } });
    return prismaUser ? mapPrismaUserToDomainUser(prismaUser) : null;
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt"> & { email: string }): Promise<User> {
    const prismaUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name ?? null,
        password: data.password ?? null,
        image: data.image ?? null,
        provider: data.provider ?? null,
        providerAccountId: data.providerAccountId ?? null,
      },
    });
    return mapPrismaUserToDomainUser(prismaUser);
  }
} 