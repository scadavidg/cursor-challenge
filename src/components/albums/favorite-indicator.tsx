"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/favorites-context"; // Cambio de import para usar el contexto global
import { cn } from "@/lib/utils";

interface FavoriteIndicatorProps {
  albumId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteIndicator({ albumId, className, size = "md" }: FavoriteIndicatorProps) {
  const { isFavorite } = useFavorites();

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Heart
      className={cn(
        sizeClasses[size],
        isFavorite(albumId) 
          ? "fill-red-500 text-red-500" 
          : "text-muted-foreground hover:text-red-500",
        className
      )}
    />
  );
} 