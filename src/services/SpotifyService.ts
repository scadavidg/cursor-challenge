import qs from "querystring";
import { Buffer } from "node:buffer";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export class SpotifyService {
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
    // Usar formato query:rock para mejores resultados
    const q = query ? `${query}:rock` : 'rock';
    const data = await this.fetchSpotify("/search", {
      q,
      type: "album",
      limit,
      offset
    });
    return data.albums;
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
} 