import { useEffect } from 'react';
import { cacheManager, CACHE_KEYS } from '@/lib/cache';
import { useFavorites } from './use-favorites';

export function useCacheInvalidation() {
  const { favorites } = useFavorites();

  useEffect(() => {
    // Cuando cambien los favoritos, invalidar el caché de álbumes
    // Esto asegura que si un álbum se elimina de favoritos, no se muestre en caché
    const invalidateAlbumCache = async () => {
      // Solo invalidar si hay favoritos (para evitar invalidaciones innecesarias al cargar)
      if (favorites && favorites.length > 0) {
        // Invalidar todos los álbumes que ya no están en favoritos
        // Nota: Esta es una invalidación conservadora que limpia todo el caché
        // En una implementación más sofisticada, podrías trackear qué álbumes específicos
        // se eliminaron y solo invalidar esos
        await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS);
      }
    };

    invalidateAlbumCache();
  }, [favorites]);

  // Función para invalidar manualmente el caché
  const invalidateAllCache = async () => {
    await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS);
    await cacheManager.invalidate(CACHE_KEYS.DEEZER_PREVIEWS);
  };

  // Función para limpiar todo el caché
  const clearAllCache = async () => {
    await cacheManager.clear();
  };

  return {
    invalidateAllCache,
    clearAllCache,
  };
} 