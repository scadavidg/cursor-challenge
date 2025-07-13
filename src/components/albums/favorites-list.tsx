"use client";

import { useState, useMemo } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { AlbumCard } from "./album-card";
import { Button } from "@/components/ui/button";
import { FavoritesSearch } from "./favorites-search";
import { FavoritesSort } from "./favorites-sort";
import Link from "next/link";
import { Music, Heart, Search } from "lucide-react";
import type { Album } from "@/lib/types";
import { removeDuplicateAlbums, filterAlbumsByQuery, sortAlbums } from "@/lib/album-utils";

export function FavoritesList() {
  const { favorites, isLoading } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"dateAdded" | "title" | "artist">("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filtrado local
  const filteredFavorites = useMemo(() => filterAlbumsByQuery(favorites, searchQuery), [favorites, searchQuery]);

  // Ordenamiento local
  const sortedFavorites = useMemo(() => sortAlbums(filteredFavorites, sortField, sortOrder), [filteredFavorites, sortField, sortOrder]);

  // Elimina duplicados por id
  const uniqueFavorites = useMemo(() => removeDuplicateAlbums(sortedFavorites), [sortedFavorites]);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Cargando tus favoritos...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 bg-accent/50 rounded-lg border-2 border-dashed">
        <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-2xl font-semibold font-headline">Tu colección está vacía</h3>
        <p className="mt-2 text-muted-foreground">
          Busca álbumes de rock y agrégalos a tus favoritos para verlos aquí.
        </p>
        <Button asChild className="mt-6">
          <Link href="/home">Comenzar a buscar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-headline font-bold">Tus favoritos</h2>
        <span className="text-sm text-muted-foreground">({sortedFavorites.length} álbumes)</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <FavoritesSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FavoritesSort
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>
      {uniqueFavorites.length === 0 ? (
        searchQuery.trim() === "" ? (
          <div className="text-center py-12">
            <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">¡Usa la barra de búsqueda para encontrar tus álbumes favoritos rápidamente!</h3>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No se encontraron álbumes</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda.</p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uniqueFavorites.map((album) => (
            <AlbumCard key={album.id} album={album} variant="favorite" />
          ))}
        </div>
      )}
    </div>
  );
}
