export interface IExternalMusicService {
  getRockAlbums(page: number, limit: number): Promise<any>;
  searchRockAlbums(query: string, page: number, limit: number): Promise<any>;
  getAlbumDetails(albumId: string): Promise<any>;
  getAlbumTracks(albumId: string): Promise<any>;
  getTrackPreview(songName: string): Promise<string | null>;
} 