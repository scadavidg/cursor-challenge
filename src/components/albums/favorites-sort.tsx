"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface FavoritesSortProps {
  sortField: "dateAdded" | "title" | "artist";
  setSortField: (field: "dateAdded" | "title" | "artist") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export function FavoritesSort({ sortField, setSortField, sortOrder, setSortOrder }: FavoritesSortProps) {
  const handleFieldChange = (field: "dateAdded" | "title" | "artist") => {
    setSortField(field);
  };

  const handleOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Ordenar por:</span>
      <Select value={sortField} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dateAdded">Fecha de agregado</SelectItem>
          <SelectItem value="title">Título</SelectItem>
          <SelectItem value="artist">Artista</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOrderChange}
        className="flex items-center gap-1"
      >
        {sortOrder === "asc" ? (
          <>
            <ArrowUp className="h-4 w-4" />
            Ascendente
          </>
        ) : (
          <>
            <ArrowDown className="h-4 w-4" />
            Descendente
          </>
        )}
      </Button>
    </div>
  );
} 