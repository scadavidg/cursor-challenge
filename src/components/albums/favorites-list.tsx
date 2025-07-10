"use client";

import { useFavorites } from "@/contexts/favorites-context";
import { AlbumCard } from "./album-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Music, Heart } from "lucide-react";

export function FavoritesList() {
  const { favorites } = useFavorites();

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
        <span className="text-sm text-muted-foreground">({favorites.length} álbumes)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((album) => (
          <AlbumCard key={album.id} album={album} variant="favorite" />
        ))}
      </div>
    </div>
  );
}
