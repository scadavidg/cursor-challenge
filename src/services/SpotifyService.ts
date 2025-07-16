import qs from "querystring";
import { Buffer } from "node:buffer";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

import { IExternalMusicService } from "@/domain/services/IExternalMusicService";
import { RockKeywordService } from "./RockKeywordService";

/**
 * Umbral de similitud (Levenshtein) para considerar que un término de búsqueda
 * es suficientemente parecido a una keyword de rock de la base de datos.
 * Valores más bajos hacen la búsqueda más permisiva, valores más altos la hacen más estricta.
 * Ejemplo: 0.4 = 40% de similitud.
 */
const ROCK_KEYWORD_SIMILARITY_THRESHOLD = 0.4;

// Algoritmo de Levenshtein para similitud
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = 1 + Math.min(
          matrix[i - 1][j],    // eliminación
          matrix[i][j - 1],    // inserción
          matrix[i - 1][j - 1] // sustitución
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const lev = levenshtein(a, b);
  return (maxLen - lev) / maxLen;
}

export class SpotifyService implements IExternalMusicService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID!;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    if (!this.clientId || !this.clientSecret) {
      throw new Error("SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET deben estar definidos en el entorno");
    }
  }

  private async authenticate() {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) return;
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const res = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify({ grant_type: "client_credentials" })
    });
    const data = await res.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  }

  private async fetchSpotify(endpoint: string, params: Record<string, any> = {}) {
    await this.authenticate();
    const url = `${SPOTIFY_API_URL}${endpoint}?${qs.stringify(params)}`;
    const curl = [
      'curl',
      '-X', 'GET',
      `'${url}'`,
      '-H', `'Authorization: Bearer ${this.accessToken}'`
    ].join(' ');
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${this.accessToken}` }
    });
    if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
    return res.json();
  }

  // Buscar álbumes de rock (por nombre o artista)
  async searchRockAlbums(query: string, page: number = 1, limit: number = 12) {
    await this.authenticate();
    const offset = (page - 1) * limit;
    let q = '';
    if (query) {
      // Verificar similitud con keywords de la BD
      const keywords = await RockKeywordService.getAllKeywords();
      const match = keywords.find(k => similarity(query, k) >= ROCK_KEYWORD_SIMILARITY_THRESHOLD);
      if (match) {
        q = `${query} rock`;
      } else {
        // Si no hay match suficiente, buscar solo por género rock
        q = 'rock';
      }
    } else {
      q = 'rock';
    }
    const data = await this.fetchSpotify("/search", {
      q,
      type: "album",
      limit,
      offset
    });
    const result = {
      items: data.albums?.items || [],
      total: data.albums?.total || 0
    };
    return result;
  }

  // Explorar álbumes de rock populares
  async getRockAlbums(page: number = 1, limit: number = 12) {
    await this.authenticate();
    const offset = (page - 1) * limit;
    // Usar búsqueda genérica de rock para explorar
    const data = await this.fetchSpotify("/search", {
      q: "rock",
      type: "album",
      limit,
      offset
    });
    return data.albums;
  }

  // Obtener información detallada de un álbum incluyendo sus canciones
  async getAlbumDetails(albumId: string) {
    await this.authenticate();
    const data = await this.fetchSpotify(`/albums/${albumId}`);
    return data;
  }

  // Obtener las canciones de un álbum con información de preview
  async getAlbumTracks(albumId: string) {
    await this.authenticate();
    const data = await this.fetchSpotify(`/albums/${albumId}/tracks`, {
      limit: 50 // Obtener todas las canciones del álbum
    });
    return data;
  }

  // Spotify no proporciona previews directos, este método retorna null
  async getTrackPreview(songName: string): Promise<string | null> {
    return null;
  }
} 