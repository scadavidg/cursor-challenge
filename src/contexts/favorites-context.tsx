"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Album } from "@/lib/types";

interface FavoritesContextType {
  favorites: Album[];
  addFavorite: (album: Album) => void;
  removeFavorite: (albumId: string) => void;
  isFavorite: (albumId: string) => boolean;
  addSampleFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Album[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favoriteAlbums");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        // Add sample favorites for new users
        // setFavorites(sampleFavorites); // Eliminar sampleFavorites y su uso. Inicializar favoritos como [] por defecto.
        updateLocalStorage([]);
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
    }
  }, []);

  const updateLocalStorage = (updatedFavorites: Album[]) => {
    try {
      localStorage.setItem("favoriteAlbums", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage", error);
    }
  };

  const addFavorite = (album: Album) => {
    setFavorites((prevFavorites) => {
      const newFavorites = [...prevFavorites, album];
      updateLocalStorage(newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = (albumId: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter((album) => album.id !== albumId);
      updateLocalStorage(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (albumId: string) => {
    return favorites.some((album) => album.id === albumId);
  };

  const addSampleFavorites = () => {
    setFavorites((prevFavorites) => {
      // const newFavorites = [...prevFavorites, ...sampleFavorites]; // Eliminar sampleFavorites y su uso. Inicializar favoritos como [] por defecto.
      updateLocalStorage([]);
      return [];
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, addSampleFavorites }}>
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
