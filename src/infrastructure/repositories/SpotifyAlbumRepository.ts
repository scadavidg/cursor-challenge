import { SpotifyService } from "@/services/SpotifyService";
import { Album } from "@/domain/entities/Album";

export class SpotifyAlbumRepository {
  private spotifyService: SpotifyService;

  constructor() {
    this.spotifyService = new SpotifyService();
  }

  async getRockAlbums(page: number = 1, limit: number = 12): Promise<Album[]> {
    const data = await this.spotifyService.getRockAlbums(page, limit);
    return data.items.map((item: any) => Album.fromSpotify(item));
  }

  async searchRockAlbums(query: string, page: number = 1, limit: number = 12): Promise<Album[]> {
    const data = await this.spotifyService.searchRockAlbums(query, page, limit);
    return data.items.map((item: any) => Album.fromSpotify(item));
  }
} 