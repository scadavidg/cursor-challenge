import { SpotifyAlbumRepository } from "@/infrastructure/repositories/SpotifyAlbumRepository";

export class AlbumUseCases {
  private albumRepository: SpotifyAlbumRepository;

  constructor() {
    this.albumRepository = new SpotifyAlbumRepository();
  }

  async getRockAlbums(page: number = 1, limit: number = 12) {
    return this.albumRepository.getRockAlbums(page, limit);
  }

  async searchRockAlbums(query: string, page: number = 1, limit: number = 12) {
    return this.albumRepository.searchRockAlbums(query, page, limit);
  }
} 