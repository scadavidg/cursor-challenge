"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, LoaderCircle, TrendingUp, Trash2, X } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlbumCard } from "./album-card";
import { SearchSuggestions } from "./search-suggestions";
import type { Album } from "@/lib/types";
import { mockSearchAlbums, mockGetTrendingAlbums } from "@/lib/mocks";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

const searchFormSchema = z.object({
  query: z.string().min(1, { message: "Please enter something to search." }),
});

export function AlbumSearch() {
  const [trendingAlbums, setTrendingAlbums] = useState<Album[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: "" },
  });

  // Load trending albums on component mount
  useEffect(() => {
    const loadTrendingAlbums = async () => {
      try {
        const trending = await mockGetTrendingAlbums();
        setTrendingAlbums(trending);
      } catch (error) {
        console.error('Failed to load trending albums:', error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    loadTrendingAlbums();
  }, []);

  // Infinite scroll for search results
  const loadMoreSearchResults = useCallback(async (page: number) => {
    if (!currentQuery.trim()) {
      return { data: [], hasMore: false, page };
    }
    
    const result = await mockSearchAlbums(currentQuery, page, 12);
    return {
      data: result.albums,
      hasMore: result.hasMore,
      page: result.page
    };
  }, [currentQuery]);

  // Log render state
  console.log("[AlbumSearch] Render: currentQuery=", currentQuery, "hasSearched=", hasSearched, "enabled=", hasSearched && currentQuery.trim().length > 0);

  const {
    data: searchResults,
    isLoading,
    error,
    hasMore,
    reset: resetSearch,
    loadingRef,
    loadMore
  } = useInfiniteScroll(loadMoreSearchResults, {
    enabled: hasSearched && currentQuery.trim().length > 0
  });

  // Forzar carga inicial cuando la búsqueda está habilitada y la lista está vacía
  useEffect(() => {
    if (hasSearched && currentQuery.trim().length > 0 && searchResults.length === 0 && !isLoading && hasMore) {
      loadMore();
    }
  }, [hasSearched, currentQuery, searchResults.length, isLoading, hasMore, loadMore]);

  // Load initial albums when no search is performed
  useEffect(() => {
    if (!hasSearched) {
      setCurrentQuery("");
      resetSearch();
    }
  }, [hasSearched, resetSearch]);

  // Debounced search on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("[AlbumSearch] Input changed:", value);
    form.setValue("query", value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      console.log("[AlbumSearch] Debounced search triggered for:", value);
      setCurrentQuery(value);
      setHasSearched(true);
      resetSearch();
    }, 300);
  };

  // Handler para limpiar el campo de búsqueda
  const handleClear = () => {
    form.setValue("query", "");
    setCurrentQuery("");
    setHasSearched(false);
    resetSearch();
  };

  const onSubmit = async (values: z.infer<typeof searchFormSchema>) => {
    setCurrentQuery(values.query);
    setHasSearched(true);
    resetSearch();
  };

  const handleSuggestionSearch = (query: string) => {
    form.setValue('query', query);
    setCurrentQuery(query);
    setHasSearched(true);
    resetSearch();
  };

  return (
    <div>
      <Form {...form}>
        <form className="relative max-w-2xl mx-auto mb-12">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Search for an album or artist..."
                      {...field}
                      className={clsx(
                        "text-lg p-6 pr-14 rounded-2xl border-2 border-primary/60 bg-white/90 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow-lg",
                        "placeholder:text-primary/50 text-primary font-semibold"
                      )}
                      onChange={handleInputChange}
                    />
                    {form.watch("query") && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-destructive focus:outline-none"
                        tabIndex={0}
                        aria-label="Clear search"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((album) => (
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
          {!hasMore && searchResults.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No more albums to load</p>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-10 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-destructive">Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => resetSearch()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Show trending albums when no search has been performed */}
      {!hasSearched && !isLoadingTrending && trendingAlbums.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-headline font-bold">Trending Albums</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} variant="search" />
            ))}
          </div>
          <SearchSuggestions onSearch={handleSuggestionSearch} />
        </div>
      )}

      {!hasSearched && isLoadingTrending && (
        <div className="text-center py-10">
          <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading trending albums...</p>
        </div>
      )}
    </div>
  );
}
