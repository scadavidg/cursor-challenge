"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface FavoritesSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function FavoritesSearch({ searchQuery, setSearchQuery }: FavoritesSearchProps) {
  return (
    <div className="relative mb-6 w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Buscar en tus favoritos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchQuery && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
} 