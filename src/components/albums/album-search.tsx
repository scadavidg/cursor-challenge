"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, LoaderCircle, Trash2, X } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlbumCard } from "./album-card";
import { SearchSuggestions } from "./search-suggestions";
import type { Album } from "@/lib/types";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

const searchFormSchema = z.object({
  query: z.string().min(1, { message: "Por favor ingresa algo para buscar." }),
});

const ROCK_MESSAGES = [
  "¡Solo aceptamos rock! Intenta con algo más ruidoso 🤘",
  "¿Pop? ¿Reggaetón? Aquí solo suena el rock, baby.",
  "¡Eso no es rock! Prueba con AC/DC, Queen o Nirvana.",
  "¡Ups! Este escenario es solo para rockstars. Busca algo más rockero.",
  "¡Prohibido el reggaetón! Aquí solo guitarras eléctricas y baterías.",
  "¡No encontramos nada! Pero si fuera rock, seguro sí. 🤟",
  "¡Eso no es suficientemente ruidoso! Solo aceptamos rock del bueno.",
  "¿Intentando colar algo que no es rock? ¡No en mi guardia!",
  "¡Aquí solo se permiten riffs y solos de guitarra!",
  "¡Eso no es rock! Pero puedes intentarlo con Led Zeppelin, The Beatles o Pink Floyd."
];

export function AlbumSearch() {
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [funMessage, setFunMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: "" },
  });

  // Infinite scroll for search results
  const loadMoreSearchResults = useCallback(async (page: number) => {
    if (!currentQuery.trim()) {
      return { data: [], hasMore: false, page };
    }
    const res = await fetch(`/api/albums/search?query=${encodeURIComponent(currentQuery)}&page=${page}&limit=12`);
    if (!res.ok) throw new Error('Error al buscar álbumes');
    const result = await res.json();
    // Si el backend envía un mensaje cómico, guárdalo
    if (result.funMessage) setFunMessage(result.funMessage);
    else setFunMessage(null);
    return {
      data: result.albums as Album[],
      hasMore: result.hasMore, // Usar el valor real del backend
      page: result.page
    };
  }, [currentQuery]);

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
  }, [hasSearched, currentQuery, searchResults.length, isLoading, hasMore]);

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
    form.setValue("query", value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
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
                      placeholder="Busca un álbum o artista de rock..."
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

      {/* Mensaje de invitación cuando no se ha buscado nada */}
      {!hasSearched && !form.watch("query") && (
        <div className="text-center py-10 bg-accent/50 rounded-lg">
          <h3 className="text-xl font-semibold">¡Empieza a buscar tu álbum o artista de rock favorito!</h3>
          <p className="text-muted-foreground mt-2">Escribe el nombre de un álbum o artista y descubre música increíble.</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Buscando álbumes...</p>
        </div>
      )}

      {/* Mostrar mensaje cómico si el backend lo envía y no hay resultados */}
      {!isLoading && hasSearched && funMessage && searchResults.length === 0 && (
        <div className="text-center py-10 bg-accent/50 rounded-lg">
          <h3 className="text-xl font-semibold">{funMessage}</h3>
        </div>
      )}

      {/* Mensaje genérico si no hay resultados y no hay mensaje cómico */}
      {!isLoading && hasSearched && !funMessage && searchResults.length === 0 && (
        <div className="text-center py-10 bg-accent/50 rounded-lg">
          <h3 className="text-xl font-semibold">No se encontraron resultados</h3>
          <p className="text-muted-foreground mt-2">Intenta con otro término de búsqueda.</p>
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
                  <span className="text-muted-foreground">Cargando más álbumes...</span>
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
      {/* Removed trending albums section */}
    </div>
  );
}
