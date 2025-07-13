import { IExternalMusicService } from "@/domain/services/IExternalMusicService";
import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";
import { Album } from "@/domain/entities/Album";

export class SpotifyAlbumRepository implements IAlbumRepository {
  constructor(private spotifyService: IExternalMusicService) {}

  async getRockAlbums(page: number = 1, limit: number = 12): Promise<Album[]> {
    const data = await this.spotifyService.getRockAlbums(page, limit);
    return data.items.map((item: any) => Album.fromSpotify(item));
  }

  async searchRockAlbums(query: string, page: number = 1, limit: number = 12): Promise<{ albums: Album[], hasMore: boolean }> {
    const data = await this.spotifyService.searchRockAlbums(query, page, limit);
    const albums = data.items.map((item: any) => Album.fromSpotify(item));
    const total = data.total;
    const hasMore = page * limit < total;
    return { albums, hasMore };
  }

  async getAlbumDetails(albumId: string): Promise<any> {
    return await this.spotifyService.getAlbumDetails(albumId);
  }

  async getAlbumTracks(albumId: string): Promise<any> {
    return await this.spotifyService.getAlbumTracks(albumId);
  }
} 