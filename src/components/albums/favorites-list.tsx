"use client";

import { useFavorites } from "@/contexts/favorites-context";
import { AlbumCard } from "./album-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Music } from "lucide-react";

export function FavoritesList() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 bg-accent/50 rounded-lg border-2 border-dashed">
        <Music className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-2xl font-semibold font-headline">Your collection is empty</h3>
        <p className="mt-2 text-muted-foreground">
          Search for albums and add them to your favorites to see them here.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Start Searching</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {favorites.map((album) => (
        <AlbumCard key={album.id} album={album} variant="favorite" />
      ))}
    </div>
  );
}
