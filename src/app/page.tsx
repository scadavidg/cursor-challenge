"use client";

import { AlbumSearch } from "@/components/albums/album-search";

export default function Home() {
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-2">
          Discover Your Next Favorite Album
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Search for any album and add it to your personal collection.
        </p>
      </div>
      <AlbumSearch />
    </div>
  );
}
