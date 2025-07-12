interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  memoryTtl: number; // TTL para caché en memoria (más corto)
  storageTtl: number; // TTL para localStorage (más largo)
  maxMemoryItems: number; // Máximo número de items en memoria
}

class CacheManager {
  private memoryCache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      memoryTtl: 5 * 60 * 1000, // 5 minutos para memoria
      storageTtl: 30 * 60 * 1000, // 30 minutos para localStorage
      maxMemoryItems: 50,
      ...config,
    };

    // Limpiar caché expirado al inicializar
    this.cleanupExpired();
    
    // Limpiar caché expirado cada minuto
    setInterval(() => this.cleanupExpired(), 60 * 1000);
  }

  private generateKey(prefix: string, identifier: string): string {
    return `${prefix}:${identifier}`;
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private cleanupExpired(): void {
    // Limpiar memoria
    for (const [key, item] of this.memoryCache.entries()) {
      if (this.isExpired(item)) {
        this.memoryCache.delete(key);
      }
    }

    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('cache:')) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '');
            if (this.isExpired(item)) {
              localStorage.removeItem(key);
            }
          } catch {
            // Si hay error al parsear, eliminar el item
            localStorage.removeItem(key);
          }
        }
      }
    }
  }

  private enforceMemoryLimit(): void {
    if (this.memoryCache.size > this.config.maxMemoryItems) {
      // Eliminar el item más antiguo
      let oldestKey: string | null = null;
      let oldestTime = Date.now();

      for (const [key, item] of this.memoryCache.entries()) {
        if (item.timestamp < oldestTime) {
          oldestTime = item.timestamp;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }
  }

  async get<T>(prefix: string, identifier: string): Promise<T | null> {
    const key = this.generateKey(prefix, identifier);

    // Buscar en memoria primero
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.data;
    }

    // Buscar en localStorage
    if (typeof window !== 'undefined') {
      try {
        const storageItem = localStorage.getItem(key);
        if (storageItem) {
          const item: CacheItem<T> = JSON.parse(storageItem);
          if (!this.isExpired(item)) {
            // Mover a memoria para acceso más rápido
            this.memoryCache.set(key, item);
            this.enforceMemoryLimit();
            return item.data;
          } else {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Si hay error al parsear, eliminar el item
        localStorage.removeItem(key);
      }
    }

    return null;
  }

  async set<T>(prefix: string, identifier: string, data: T, ttl?: number): Promise<void> {
    const key = this.generateKey(prefix, identifier);
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.memoryTtl,
    };

    // Guardar en memoria
    this.memoryCache.set(key, item);
    this.enforceMemoryLimit();

    // Guardar en localStorage con TTL más largo
    if (typeof window !== 'undefined') {
      try {
        const storageItem: CacheItem<T> = {
          ...item,
          ttl: this.config.storageTtl,
        };
        localStorage.setItem(key, JSON.stringify(storageItem));
      } catch (error) {
        console.warn('Error al guardar en localStorage:', error);
      }
    }
  }

  async invalidate(prefix: string, identifier?: string): Promise<void> {
    if (identifier) {
      const key = this.generateKey(prefix, identifier);
      this.memoryCache.delete(key);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } else {
      // Invalidar todos los items con el prefijo
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(prefix + ':')) {
          this.memoryCache.delete(key);
        }
      }

      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          if (key.startsWith(prefix + ':')) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  // Método para obtener estadísticas del caché
  getStats() {
    let storageCount = 0;
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      storageCount = keys.filter(key => key.startsWith('cache:')).length;
    }

    return {
      memoryItems: this.memoryCache.size,
      storageItems: storageCount,
      maxMemoryItems: this.config.maxMemoryItems,
    };
  }
}

// Instancia global del caché
export const cacheManager = new CacheManager();

// Tipos para facilitar el uso
export type AlbumCache = {
  id: string;
  details: any;
  tracks: any;
};

export type DeezerPreviewsCache = {
  songNames: string[];
  previews: Record<string, string | null>;
};

// Constantes para los prefijos de caché
export const CACHE_KEYS = {
  ALBUM_DETAILS: 'album-details',
  DEEZER_PREVIEWS: 'deezer-previews',
} as const; 