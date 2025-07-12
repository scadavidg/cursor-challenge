"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Album } from "@/lib/types";
import { useAuth } from "./auth-context";
import { FavoriteService } from "@/services/FavoriteService";

interface FavoritesContextType {
  favorites: Album[];
  addFavorite: (album: Album) => Promise<void>;
  removeFavorite: (albumId: string) => Promise<void>;
  isFavorite: (albumId: string) => boolean;
  isLoading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    try {
      setIsLoading(true);
      const favorites = await FavoriteService.getFavorites();
      console.log('[FavoritesContext] Favoritos obtenidos:', favorites);
      setFavorites(favorites);
    } catch (error) {
      console.error('[FavoritesContext] Error al obtener favoritos:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = async (albumId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      return await FavoriteService.checkFavorite(albumId);
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  const addFavorite = async (album: Album) => {
    if (!isAuthenticated) {
      throw new Error("Debes iniciar sesión para agregar favoritos");
    }

    try {
      await FavoriteService.addFavorite(album);
      console.log('[FavoritesContext] Álbum agregado a favoritos:', album);
      // Actualizar la lista de favoritos
      await fetchFavorites();
    } catch (error) {
      console.error('[FavoritesContext] Error al agregar favorito:', error);
      throw error;
    }
  };

  const removeFavorite = async (albumId: string) => {
    if (!isAuthenticated) {
      throw new Error("Debes iniciar sesión para remover favoritos");
      return;
    }

    try {
      await FavoriteService.removeFavorite(albumId);
      console.log('[FavoritesContext] Álbum removido de favoritos:', albumId);
      // Actualizar la lista de favoritos
      await fetchFavorites();
    } catch (error) {
      console.error('[FavoritesContext] Error al remover favorito:', error);
      throw error;
    }
  };

  const isFavorite = (albumId: string): boolean => {
    return favorites.some((album) => album.id === albumId);
  };

  const refreshFavorites = async () => {
    await fetchFavorites();
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite, 
      isFavorite, 
      isLoading,
      refreshFavorites 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
