import { FavoriteRepository } from "@/infrastructure/repositories/FavoriteRepository";
import type { Album } from "@/lib/types";

export class FavoriteUseCases {
  private favoriteRepository: FavoriteRepository;

  constructor() {
    this.favoriteRepository = new FavoriteRepository();
  }

  async addToFavorites(userId: string, album: Album): Promise<void> {
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    if (!album || !album.id) {
      throw new Error("Álbum inválido");
    }

    // Verificar si ya es favorito para evitar duplicados
    const isAlreadyFavorite = await this.favoriteRepository.isFavorite(userId, album.id);
    if (isAlreadyFavorite) {
      throw new Error("El álbum ya está en tus favoritos");
    }

    await this.favoriteRepository.addFavorite(userId, album);
  }

  async removeFromFavorites(userId: string, albumId: string): Promise<void> {
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    if (!albumId) {
      throw new Error("ID de álbum inválido");
    }

    const wasRemoved = await this.favoriteRepository.removeFavorite(userId, albumId);
    if (!wasRemoved) {
      throw new Error("El álbum no estaba en tus favoritos");
    }
  }

  async getUserFavorites(userId: string): Promise<Album[]> {
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const favorites = await this.favoriteRepository.getUserFavorites(userId);
    
    // Convertir a formato Album para mantener consistencia
    return favorites.map(favorite => ({
      id: favorite.albumId,
      title: favorite.albumName,
      artist: favorite.artist,
      coverArt: favorite.imageUrl || "/default-album-image.png",
    }));
  }

  async isFavorite(userId: string, albumId: string): Promise<boolean> {
    if (!userId || !albumId) {
      return false;
    }

    return await this.favoriteRepository.isFavorite(userId, albumId);
  }

  async getFavoriteCount(userId: string): Promise<number> {
    if (!userId) {
      return 0;
    }

    return await this.favoriteRepository.getFavoriteCount(userId);
  }
} 