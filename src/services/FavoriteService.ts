import type { Album } from "@/lib/types";

export class FavoriteService {
  static async getFavorites(): Promise<Album[]> {
    const response = await fetch("/api/favorites");
    if (!response.ok) {
      throw new Error("Error al obtener favoritos");
    }
    const data = await response.json();
    // Compatibilidad con ambas formas de respuesta
    return (data.data && data.data.favorites) || data.favorites || [];
  }

  static async addFavorite(album: Album): Promise<void> {
    const response = await fetch("/api/favorites/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ album }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al agregar favorito");
    }
  }

  static async removeFavorite(albumId: string): Promise<void> {
    const response = await fetch(`/api/favorites/remove?albumId=${albumId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al remover favorito");
    }
  }

  static async checkFavorite(albumId: string): Promise<boolean> {
    const response = await fetch(`/api/favorites/check?albumId=${albumId}`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.isFavorite;
  }
} 