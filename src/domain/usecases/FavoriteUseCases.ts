import { IFavoriteRepository } from "@/domain/repositories/IFavoriteRepository";
import { Album } from "@/domain/entities/Album";

export class FavoriteUseCases {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async getFavorites(): Promise<Album[]> {
    return await this.favoriteRepository.getFavorites();
  }

  async addFavorite(album: Album): Promise<void> {
    await this.favoriteRepository.addFavorite(album);
  }

  async removeFavorite(albumId: string): Promise<void> {
    await this.favoriteRepository.removeFavorite(albumId);
  }

  async checkFavorite(albumId: string): Promise<boolean> {
    return await this.favoriteRepository.checkFavorite(albumId);
  }
} 