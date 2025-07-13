"use client";
import { useState } from "react";
import { FavoritesList } from "@/components/albums/favorites-list";
import { FavoritesStats } from "@/components/albums/favorites-stats";
import type { Album } from "@/lib/types";

export default function FavoritesPage() {
  const [currentFavorites, setCurrentFavorites] = useState<Album[]>([]);
  return (
    <div className="container mx-auto px-2 sm:px-4 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
          Tus Favoritos
        </h1>
        <p className="text-lg text-muted-foreground">
          Aquí están tus álbumes guardados.
        </p>
      </div>
      <div className="mb-8">
        <FavoritesStats favorites={currentFavorites} />
      </div>
      <FavoritesList onFavoritesChange={setCurrentFavorites} />
    </div>
  );
} 