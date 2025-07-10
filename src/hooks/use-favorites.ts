import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { FavoriteService } from "@/services/FavoriteService";
import type { Album } from "@/lib/types";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const favoritesData = await FavoriteService.getFavorites();
      setFavorites(favoritesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar favoritos");
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addFavorite = useCallback(async (album: Album) => {
    if (!isAuthenticated) {
      throw new Error("Debes iniciar sesión para agregar favoritos");
    }

    try {
      setError(null);
      await FavoriteService.addFavorite(album);
      // Actualizar la lista local optimísticamente
      setFavorites(prev => [...prev, album]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar favorito");
      throw err;
    }
  }, [isAuthenticated]);

  const removeFavorite = useCallback(async (albumId: string) => {
    if (!isAuthenticated) {
      throw new Error("Debes iniciar sesión para remover favoritos");
    }

    try {
      setError(null);
      await FavoriteService.removeFavorite(albumId);
      // Actualizar la lista local optimísticamente
      setFavorites(prev => prev.filter(album => album.id !== albumId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al remover favorito");
      throw err;
    }
  }, [isAuthenticated]);

  const isFavorite = useCallback((albumId: string): boolean => {
    return favorites.some(album => album.id === albumId);
  }, [favorites]);

  const refreshFavorites = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    refreshFavorites,
  };
} 