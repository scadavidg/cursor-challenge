import { prisma } from "../db/prisma";
import { IFavoriteRepository } from "@/domain/repositories/IFavoriteRepository";
import { Album } from "@/domain/entities/Album";
import { useAuth } from "@/contexts/auth-context";

export interface Favorite {
  id: string;
  userId: string;
  albumId: string;
  albumName: string;
  artist: string;
  imageUrl?: string;
  createdAt: Date;
}

export class FavoriteRepository implements IFavoriteRepository {
  constructor(private userId?: string) {}

  async getFavorites(): Promise<Album[]> {
    if (!this.userId) {
      throw new Error("Usuario no autenticado");
    }
    const favorites = await prisma.favorite.findMany({
      where: { userId: this.userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return favorites.map((favorite: any) => new Album(
      favorite.albumId,
      favorite.albumName,
      favorite.artist,
      favorite.imageUrl || ""
    ));
  }

  async addFavorite(album: Album): Promise<void> {
    if (!this.userId) {
      throw new Error("Usuario no autenticado");
    }
    await prisma.favorite.create({
      data: {
        userId: this.userId,
        albumId: album.id,
        albumName: album.title,
        artist: album.artist,
        imageUrl: album.coverArt,
      },
    });
  }

  async removeFavorite(albumId: string): Promise<void> {
    if (!this.userId) {
      throw new Error("Usuario no autenticado");
    }
    await prisma.favorite.deleteMany({
      where: {
        userId: this.userId,
        albumId,
      },
    });
  }

  async checkFavorite(albumId: string): Promise<boolean> {
    if (!this.userId) {
      return false;
    }
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_albumId: {
          userId: this.userId,
          albumId,
        },
      },
    });
    
    return !!favorite;
  }

  async getFavoriteCount(userId: string): Promise<number> {
    return await prisma.favorite.count({
      where: { userId },
    });
  }
} 