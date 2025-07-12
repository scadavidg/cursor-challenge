import { useState, useCallback, useEffect } from 'react';
import { cacheManager, CACHE_KEYS } from '@/lib/cache';
import type { AlbumDetails } from '@/lib/types';

interface UseAlbumCacheReturn {
  albumDetails: AlbumDetails | null;
  loading: boolean;
  error: string | null;
  fetchAlbumDetails: (albumId: string) => Promise<AlbumDetails | null>;
  invalidateCache: (albumId?: string) => Promise<void>;
  isFromCache: boolean;
}

export function useAlbumCache(): UseAlbumCacheReturn {
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchAlbumDetails = useCallback(async (albumId: string): Promise<AlbumDetails | null> => {
    if (!albumId) return null;

    setLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      // Intentar obtener del caché primero
      const cachedData = await cacheManager.get<AlbumDetails>(CACHE_KEYS.ALBUM_DETAILS, albumId);
      
      if (cachedData) {
        setAlbumDetails(cachedData);
        setIsFromCache(true);
        setLoading(false);
        return cachedData;
      }

      // Si no está en caché, hacer la petición al servidor
      const res = await fetch(`/api/albums/${albumId}`);
      if (!res.ok) {
        throw new Error("No se pudo cargar el álbum");
      }
      
      const data = await res.json();
      
      // Guardar en caché
      await cacheManager.set(CACHE_KEYS.ALBUM_DETAILS, albumId, data);
      
      setAlbumDetails(data);
      setIsFromCache(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const invalidateCache = useCallback(async (albumId?: string) => {
    if (albumId) {
      await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS, albumId);
    } else {
      await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS);
    }
  }, []);

  return {
    albumDetails,
    loading,
    error,
    fetchAlbumDetails,
    invalidateCache,
    isFromCache,
  };
} 