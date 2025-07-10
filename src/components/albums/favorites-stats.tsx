"use client";

import { Heart, Music } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FavoritesStats() {
  const { favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estadísticas</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalFavorites = favorites.length;
  const uniqueArtists = new Set(favorites.map(album => album.artist)).size;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Favoritos</CardTitle>
          <Heart className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFavorites}</div>
          <p className="text-xs text-muted-foreground">
            álbumes guardados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Artistas Únicos</CardTitle>
          <Music className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueArtists}</div>
          <p className="text-xs text-muted-foreground">
            artistas diferentes
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 