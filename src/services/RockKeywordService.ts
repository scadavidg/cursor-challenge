import { prisma } from '@/infrastructure/db/prisma';

export class RockKeywordService {
  /**
   * Verifica si el término existe como keyword de rock en la base de datos
   */
  static async isRockKeyword(query: string): Promise<boolean> {
    if (!query || !query.trim()) return false;
    const keyword = query.trim().toLowerCase();
    // Busca coincidencia exacta o parcial (puedes ajustar la lógica según necesidad)
    const found = await prisma.rockKeyword.findFirst({
      where: {
        keyword: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    });
    return !!found;
  }

  /**
   * Obtiene todos los keywords de rock de la base de datos
   */
  static async getAllKeywords(): Promise<string[]> {
    const keywords = await prisma.rockKeyword.findMany({ select: { keyword: true } });
    return keywords.map((k: { keyword: string }) => k.keyword.toLowerCase());
  }
} 