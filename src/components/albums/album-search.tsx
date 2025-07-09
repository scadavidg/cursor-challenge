"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlbumCard } from "./album-card";
import type { Album } from "@/lib/types";

const mockAlbums: Album[] = [
  { id: "1", title: "Abbey Road", artist: "The Beatles", coverArt: "https://placehold.co/400x400.png" },
  { id: "2", title: "Thriller", artist: "Michael Jackson", coverArt: "https://placehold.co/400x400.png" },
  { id: "3", title: "The Dark Side of the Moon", artist: "Pink Floyd", coverArt: "https://placehold.co/400x400.png" },
  { id: "4", title: "Rumours", artist: "Fleetwood Mac", coverArt: "https://placehold.co/400x400.png" },
  { id: "5", title: "Nevermind", artist: "Nirvana", coverArt: "https://placehold.co/400x400.png" },
  { id: "6", title: "Back to Black", artist: "Amy Winehouse", coverArt: "https://placehold.co/400x400.png" },
  { id: "7", title: "Random Access Memories", artist: "Daft Punk", coverArt: "https://placehold.co/400x400.png" },
  { id: "8", title: "Blonde", artist: "Frank Ocean", coverArt: "https://placehold.co/400x400.png" },
];

const searchFormSchema = z.object({
  query: z.string().min(1, { message: "Please enter something to search." }),
});

export function AlbumSearch() {
  const [searchResults, setSearchResults] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = (values: z.infer<typeof searchFormSchema>) => {
    setIsLoading(true);
    setHasSearched(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockAlbums.filter(
        album =>
          album.title.toLowerCase().includes(values.query.toLowerCase()) ||
          album.artist.toLowerCase().includes(values.query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 max-w-2xl mx-auto mb-12">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Search for an album or artist..." {...field} className="text-lg p-6"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="h-[60px]" disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="h-6 w-6 animate-spin" />
            ) : (
              <Search className="h-6 w-6" />
            )}
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="text-center">
          <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Searching for albums...</p>
        </div>
      )}

      {!isLoading && hasSearched && searchResults.length === 0 && (
        <div className="text-center py-10 bg-accent/50 rounded-lg">
          <h3 className="text-xl font-semibold">No results found</h3>
          <p className="text-muted-foreground mt-2">Try a different search term.</p>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((album) => (
            <AlbumCard key={album.id} album={album} variant="search" />
          ))}
        </div>
      )}
    </div>
  );
}
