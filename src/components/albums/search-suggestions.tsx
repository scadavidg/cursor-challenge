"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchSuggestionsProps {
  onSearch: (query: string) => void;
}

const popularSearches = [
  "The Beatles",
  "Pink Floyd", 
  "Michael Jackson",
  "Kendrick Lamar",
  "Daft Punk",
  "Radiohead",
  "Frank Ocean",
  "Miles Davis"
];

export function SearchSuggestions({ onSearch }: SearchSuggestionsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Popular Searches</h3>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((search) => (
          <Button
            key={search}
            variant="outline"
            size="sm"
            onClick={() => onSearch(search)}
            className="flex items-center gap-2"
          >
            <Search className="h-3 w-3" />
            {search}
          </Button>
        ))}
      </div>
    </div>
  );
} 