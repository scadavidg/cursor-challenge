import { Album } from '../entities/Album';

export interface IFavoriteRepository {
  getFavorites(): Promise<Album[]>;
  addFavorite(album: Album): Promise<void>;
  removeFavorite(albumId: string): Promise<void>;
  checkFavorite(albumId: string): Promise<boolean>;
} 