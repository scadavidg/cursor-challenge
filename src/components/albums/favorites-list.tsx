"use client";

import { useState, useCallback, useEffect } from "react";
import { useFavorites } from "@/contexts/favorites-context";
import { AlbumCard } from "./album-card";
import { Button } from "@/components/ui/button";
import { FavoritesSearch } from "./favorites-search";
import { FavoritesSort } from "./favorites-sort";
import { AlbumGridSkeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Music, Heart, Search } from "lucide-react";
import type { Album } from "@/lib/types";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { removeDuplicateAlbums, filterAlbumsByQuery, sortAlbums } from "@/lib/album-utils";

export function FavoritesList({ onFavoritesChange }: { onFavoritesChange?: (favorites: Album[]) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"dateAdded" | "title" | "artist">("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Scroll infinito para favoritos paginados
  const loadMoreFavorites = useCallback(async (page: number) => {
    const res = await fetch(`/api/favorites?page=${page}&limit=12`);
    if (!res.ok) throw new Error("Error al cargar favoritos");
    const result = await res.json();
    // Compatibilidad con ambas formas de respuesta
    const favorites = (result.data && result.data.favorites) || result.favorites || [];
    const hasMore = (result.data && result.data.hasMore) ?? result.hasMore ?? false;
    const pageNum = (result.data && result.data.page) ?? result.page ?? page;
    return {
      data: favorites as Album[],
      hasMore,
      page: pageNum
    };
  }, []);

  const {
    data: favorites,
    isLoading,
    error,
    hasMore,
    reset,
    loadingRef,
    loadMore
  } = useInfiniteScroll(loadMoreFavorites);

  // Carga inicial automática
  useEffect(() => {
    if (favorites.length === 0 && !isLoading && hasMore) {
      loadMore();
    }
  }, [favorites.length, isLoading, hasMore, loadMore]);

  // Filtrado local
  const filteredFavorites = filterAlbumsByQuery(favorites, searchQuery);
  // Ordenamiento local
  const sortedFavorites = sortAlbums(filteredFavorites, sortField, sortOrder);
  // Elimina duplicados por id
  const uniqueFavoritesFiltered = removeDuplicateAlbums(sortedFavorites).filter(
    (album, index, self) => self.findIndex(a => a.id === album.id) === index
  );

  useEffect(() => {
    if (onFavoritesChange) {
      onFavoritesChange(uniqueFavoritesFiltered);
    }
  }, [uniqueFavoritesFiltered.length, onFavoritesChange]);



  if (isLoading && favorites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Music className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-headline font-bold">Mis Favoritos</h2>
        </div>
        <AlbumGridSkeleton count={8} />
      </div>
    );
  }

  if (favorites.length === 0 && !isLoading) {
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
        <span className="text-sm text-muted-foreground">({uniqueFavoritesFiltered.length} álbumes)</span>
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
      {uniqueFavoritesFiltered.length === 0 ? (
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
          {uniqueFavoritesFiltered.map((album) => (
            <AlbumCard key={album.id} album={album} variant="favorite" />
          ))}
        </div>
      )}
      {/* Infinite scroll loading indicator */}
      {hasMore && (
        <div ref={loadingRef} className="text-center py-8">
          {isLoading && (
            <div className="flex items-center justify-center gap-2">
              <Music className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Cargando más favoritos...</span>
            </div>
          )}
        </div>
      )}
      {/* End of results indicator */}
      {!hasMore && favorites.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">¡Has llegado al final! Todos tus favoritos han sido cargados.</p>
        </div>
      )}
    </div>
  );
}
