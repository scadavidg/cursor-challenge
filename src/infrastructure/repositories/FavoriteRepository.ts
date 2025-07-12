import { prisma } from "../db/prisma";
import type { Album } from "@/lib/types";

export interface Favorite {
  id: string;
  userId: string;
  albumId: string;
  albumName: string;
  artist: string;
  imageUrl?: string;
  createdAt: Date;
}

export class FavoriteRepository {
  async addFavorite(userId: string, album: Album): Promise<Favorite> {
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        albumId: album.id,
        albumName: album.title,
        artist: album.artist,
        imageUrl: album.coverArt,
      },
    });
    
    return {
      id: favorite.id,
      userId: favorite.userId,
      albumId: favorite.albumId,
      albumName: favorite.albumName,
      artist: favorite.artist,
      imageUrl: favorite.imageUrl || undefined,
      createdAt: favorite.createdAt,
    };
  }

  async removeFavorite(userId: string, albumId: string): Promise<boolean> {
    const result = await prisma.favorite.deleteMany({
      where: {
        userId,
        albumId,
      },
    });
    
    return result.count > 0;
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return favorites.map((favorite: any) => ({
      id: favorite.id,
      userId: favorite.userId,
      albumId: favorite.albumId,
      albumName: favorite.albumName,
      artist: favorite.artist,
      imageUrl: favorite.imageUrl || undefined,
      createdAt: favorite.createdAt,
    }));
  }

  async isFavorite(userId: string, albumId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_albumId: {
          userId,
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