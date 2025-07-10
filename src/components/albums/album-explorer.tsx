"use client";

import { useCallback } from "react";
import { LoaderCircle, Music } from "lucide-react";

import { AlbumCard } from "./album-card";
import { Button } from "@/components/ui/button";
import type { Album } from "@/lib/types";
import { mockGetAllAlbums } from "@/lib/mocks";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface AlbumExplorerProps {
  title?: string;
  description?: string;
}

export function AlbumExplorer({ 
  title = "All Albums", 
  description 
}: AlbumExplorerProps = {}) {
  // Infinite scroll for all albums
  const loadMoreAlbums = useCallback(async (page: number) => {
    const result = await mockGetAllAlbums(page, 12);
    return {
      data: result.albums,
      hasMore: result.hasMore,
      page: result.page
    };
  }, []);

  const {
    data: albums,
    isLoading,
    error,
    hasMore,
    reset,
    loadingRef
  } = useInfiniteScroll(loadMoreAlbums);

  if (error) {
    return (
      <div className="text-center py-20 bg-destructive/10 rounded-lg border border-destructive/20">
        <p className="text-destructive mb-4">Error: {error}</p>
        <Button variant="outline" onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (albums.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20 bg-accent/50 rounded-lg border-2 border-dashed">
        <Music className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-2xl font-semibold font-headline">No albums found</h3>
        <p className="mt-2 text-muted-foreground">
          There was an error loading the albums.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => reset()}>
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Music className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-headline font-bold">{title}</h2>
        <span className="text-sm text-muted-foreground">({albums.length} loaded)</span>
      </div>
      
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} variant="search" />
        ))}
      </div>
      
      {/* Infinite scroll loading indicator */}
      {hasMore && (
        <div ref={loadingRef} className="text-center py-8">
          {isLoading && (
            <div className="flex items-center justify-center gap-2">
              <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading more albums...</span>
            </div>
          )}
        </div>
      )}
      
      {/* End of results indicator */}
      {!hasMore && albums.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You've reached the end! All albums loaded.</p>
        </div>
      )}
    </div>
  );
} 