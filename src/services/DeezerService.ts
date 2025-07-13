const DEEZER_API_URL = "https://api.deezer.com";

import { IExternalMusicService } from "@/domain/services/IExternalMusicService";
import { logger } from "@/lib/logger";

export class DeezerService implements IExternalMusicService {
  private async fetchDeezer(endpoint: string, params: Record<string, any> = {}) {
    const url = `${DEEZER_API_URL}${endpoint}?${new URLSearchParams(params).toString()}`;
    const curl = [
      'curl',
      '-X', 'GET',
      `'${url}'`
    ].join(' ');
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Deezer API error: ${res.status}`);
    }
    return res.json();
  }

  // Buscar álbumes en Deezer
  async searchAlbums(query: string, page: number = 1, limit: number = 12) {
    const offset = (page - 1) * limit;
    const data = await this.fetchDeezer("/search", {
      q: query,
      type: "album",
      limit: limit.toString(),
      index: offset.toString()
    });
    return data;
  }

  // Obtener información detallada de un álbum
  async getAlbumDetails(albumId: string) {
    const data = await this.fetchDeezer(`/album/${albumId}`);
    return data;
  }

  // Obtener las canciones de un álbum
  async getAlbumTracks(albumId: string) {
    const data = await this.fetchDeezer(`/album/${albumId}/tracks`);
    return data;
  }

  // Buscar específicamente álbumes de rock
  async searchRockAlbums(query: string, page: number = 1, limit: number = 12) {
    const searchQuery = query ? `${query} rock` : 'rock';
    return this.searchAlbums(searchQuery, page, limit);
  }

  // Explorar álbumes de rock populares
  async getRockAlbums(page: number = 1, limit: number = 12) {
    return this.searchAlbums('rock', page, limit);
  }

  // Buscar canciones específicas
  async searchTracks(query: string, page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;
    const data = await this.fetchDeezer("/search", {
      q: query,
      type: "track",
      limit: limit.toString(),
      index: offset.toString()
    });
    return data;
  }

  // Obtener preview de una canción específica
  async getTrackPreview(songName: string): Promise<string | null> {
    try {
      const searchResult = await this.searchTracks(songName, 1, 5);
      
      if (searchResult.data && searchResult.data.length > 0) {
        // Buscar la canción más similar
        const bestMatch = searchResult.data.find((track: any) => 
          track.title.toLowerCase().includes(songName.toLowerCase()) ||
          songName.toLowerCase().includes(track.title.toLowerCase())
        );
        
        if (bestMatch && bestMatch.preview) {
          return bestMatch.preview;
        }
      }
      
      return null;
    } catch (error) {
      logger.error(`[DeezerService] Error al obtener preview para '${songName}':`, 'DeezerService', error);
      return null;
    }
  }
} 