"use client";

import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";

import type { Album } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/contexts/favorites-context";
import { useToast } from "@/hooks/use-toast";

interface AlbumCardProps {
  album: Album;
  variant?: "search" | "favorite";
}

export function AlbumCard({ album, variant = "search" }: AlbumCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const isAlbumFavorite = isFavorite(album.id);

  const handleAdd = () => {
    addFavorite(album);
    toast({ title: "Added to favorites!", description: `"${album.title}" has been saved.` });
  };

  const handleRemove = () => {
    removeFavorite(album.id);
    toast({ title: "Removed from favorites.", description: `"${album.title}" has been removed.`, variant: "destructive" });
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-0">
        <Image
          src={album.coverArt}
          alt={`Cover art for ${album.title}`}
          width={400}
          height={400}
          className="w-full h-auto aspect-square object-cover"
          data-ai-hint="album cover"
        />
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="font-headline text-lg leading-tight mb-1">{album.title}</CardTitle>
        <p className="text-muted-foreground text-sm">{album.artist}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {variant === "search" ? (
          <Button
            size="sm"
            className="w-full"
            onClick={handleAdd}
            disabled={isAlbumFavorite}
            variant={isAlbumFavorite ? "secondary" : "default"}
          >
            <Heart className="mr-2 h-4 w-4" />
            {isAlbumFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleRemove}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
