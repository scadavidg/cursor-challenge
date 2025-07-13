import { DeezerService } from "@/services/DeezerService";
import { Album } from "@/domain/entities/Album";

export class DeezerAlbumRepository {
  private deezerService: DeezerService;

  constructor() {
    this.deezerService = new DeezerService();
  }

  async getRockAlbums(page: number = 1, limit: number = 12): Promise<Album[]> {
    const data = await this.deezerService.getRockAlbums(page, limit);
    return data.data.map((item: any) => Album.fromDeezer(item));
  }

  async searchRockAlbums(query: string, page: number = 1, limit: number = 12): Promise<{ albums: Album[], hasMore: boolean }> {
    const data = await this.deezerService.searchRockAlbums(query, page, limit);
    const albums = data.data.map((item: any) => Album.fromDeezer(item));
    const total = data.total || 0;
    const hasMore = page * limit < total;
    return { albums, hasMore };
  }

  async getAlbumDetails(albumId: string) {
    const data = await this.deezerService.getAlbumDetails(albumId);
    return data;
  }

  async getAlbumTracks(albumId: string) {
    const data = await this.deezerService.getAlbumTracks(albumId);
    return data;
  }
} 