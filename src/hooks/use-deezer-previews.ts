import { useState, useCallback } from "react";
import { cacheManager, CACHE_KEYS } from "@/lib/cache";
import { logger } from "@/lib/logger";

interface UseDeezerPreviewsReturn {
  previews: Record<string, string | null>;
  isLoading: boolean;
  error: string | null;
  fetchPreviews: (songNames: string[]) => Promise<void>;
  clearPreviews: () => void;
  isFromCache: boolean;
}

export function useDeezerPreviews(): UseDeezerPreviewsReturn {
  const [previews, setPreviews] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchPreviews = useCallback(async (songNames: string[]) => {
    if (songNames.length === 0) return;

    // Filtrar canciones que ya están en el estado local
    const newSongNames = songNames.filter(name => !previews[name]);
    if (newSongNames.length === 0) return;

    setIsLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      // Crear una clave única para este conjunto de canciones
      const songNamesKey = newSongNames.sort((a, b) => a.localeCompare(b)).join('|');
      
      // Intentar obtener del caché primero
      const cachedData = await cacheManager.get<Record<string, string | null>>(
        CACHE_KEYS.DEEZER_PREVIEWS, 
        songNamesKey
      );
      
      if (cachedData) {
        setPreviews(prev => ({ ...prev, ...cachedData }));
        setIsFromCache(true);
        setIsLoading(false);
        return;
      }

      // Si no está en caché, hacer la petición al servidor
      const response = await fetch("/api/previews/deezer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songNames: newSongNames }),
      });

      if (!response.ok) {
        logger.error('[useDeezerPreviews] Error al obtener previews de Deezer:', 'useDeezerPreviews', response.status);
        throw new Error("Error al obtener previews de Deezer");
      }

      const data = await response.json();
      
      // Crear un objeto con los nombres de canciones como claves
      const previewsMap: Record<string, string | null> = {};
      newSongNames.forEach((songName, index) => {
        previewsMap[songName] = data.previews[index] || null;
      });

      // Guardar en caché
      await cacheManager.set(CACHE_KEYS.DEEZER_PREVIEWS, songNamesKey, previewsMap);

      setPreviews(prev => ({ ...prev, ...previewsMap }));
      setIsFromCache(false);
    } catch (err) {
      logger.error('[useDeezerPreviews] Error en fetchPreviews:', 'useDeezerPreviews', err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [previews]);

  const clearPreviews = useCallback(() => {
    setPreviews({});
    setError(null);
    setIsFromCache(false);
  }, []);

  return {
    previews,
    isLoading,
    error,
    fetchPreviews,
    clearPreviews,
    isFromCache,
  };
} 