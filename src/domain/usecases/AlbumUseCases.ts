import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";

export class AlbumUseCases {
  constructor(private albumRepository: IAlbumRepository) {}

  async getRockAlbums(page: number = 1, limit: number = 12) {
    return this.albumRepository.getRockAlbums(page, limit);
  }

  async searchRockAlbums(query: string, page: number = 1, limit: number = 12) {
    return this.albumRepository.searchRockAlbums(query, page, limit);
  }
} 