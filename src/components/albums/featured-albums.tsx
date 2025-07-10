"use client";

import { useCallback, useEffect } from "react";
import { LoaderCircle, Music } from "lucide-react";

import { AlbumCard } from "./album-card";
import type { Album } from "@/lib/types";
import { mockGetAllAlbums } from "@/lib/mocks";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface FeaturedAlbumsProps {
  title?: string;
  description?: string;
}

export function FeaturedAlbums({ 
  title = "Featured Albums", 
  description 
}: FeaturedAlbumsProps = {}) {
  // Log para saber si el componente se monta
  console.log("FeaturedAlbums mounted");

  // Infinite scroll for all albums (paginated)
  const loadMoreAlbums = useCallback(async (page: number) => {
    console.log("loadMoreAlbums called with page:", page);
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
    loadingRef,
    loadMore
  } = useInfiniteScroll(loadMoreAlbums);

  // Carga inicial automática
  useEffect(() => {
    if (albums.length === 0 && !isLoading && hasMore) {
      loadMore();
    }
  }, [albums.length, isLoading, hasMore, loadMore]);

  if (error) {
    return (
      <div className="text-center py-20 bg-destructive/10 rounded-lg border border-destructive/20">
        <p className="text-destructive mb-4">Error: {error}</p>
        <button className="btn" onClick={() => reset()}>
          Try Again
        </button>
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
        <button className="btn mt-6" onClick={() => reset()}>
          Reload
        </button>
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
          <p className="text-muted-foreground">You've seen all albums!</p>
        </div>
      )}
    </div>
  );
} 