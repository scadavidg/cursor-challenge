import { Album } from '../entities/Album';

export interface IAlbumRepository {
  getRockAlbums(page: number, limit: number): Promise<Album[]>;
  searchRockAlbums(query: string, page: number, limit: number): Promise<{ albums: Album[], hasMore: boolean }>;
  getAlbumDetails(albumId: string): Promise<any>;
  getAlbumTracks(albumId: string): Promise<any>;
} 