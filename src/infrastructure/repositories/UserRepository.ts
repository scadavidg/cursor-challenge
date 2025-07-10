import { prisma } from "../db/prisma";
import { User } from "../../domain/entities/User";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    return prisma.user.create({ data });
  }
} 