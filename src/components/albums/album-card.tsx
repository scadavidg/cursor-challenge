"use client";

import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";

import type { Album } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";

interface AlbumCardProps {
  album: Album;
  variant?: "search" | "favorite";
}

export function AlbumCard({ album, variant = "search" }: AlbumCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isAlbumFavorite = isFavorite(album.id);

  // Estado para manejar el src de la imagen
  const [imgSrc, setImgSrc] = useState(album.coverArt);

  const handleAdd = async () => {
    try {
      setIsLoading(true);
      await addFavorite(album);
      toast({ title: "¡Agregado a favoritos!", description: `"${album.title}" ha sido guardado.` });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Error al agregar a favoritos", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsLoading(true);
      await removeFavorite(album.id);
      toast({ title: "Removido de favoritos", description: `"${album.title}" ha sido removido.`, variant: "destructive" });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Error al remover de favoritos", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para alternar favorito en modo search
  const handleToggleFavorite = async () => {
    if (isAlbumFavorite) {
      await handleRemove();
    } else {
      await handleAdd();
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-0">
        <Image
          src={imgSrc}
          alt={`Cover art for ${album.title}`}
          width={400}
          height={400}
          className="w-full h-auto aspect-square object-cover"
          data-ai-hint="album cover"
          onError={() => setImgSrc("/default-album-image.png")}
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
            onClick={handleToggleFavorite}
            disabled={isLoading}
            variant={isAlbumFavorite ? "destructive" : "default"}
          >
            {isAlbumFavorite ? (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {isLoading ? "Removiendo..." : "Quitar de Favoritos"}
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                {isLoading ? "Agregando..." : "Agregar a Favoritos"}
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleRemove}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isLoading ? "Removiendo..." : "Remover"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
