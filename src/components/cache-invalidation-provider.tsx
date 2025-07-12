"use client";

import { useCacheInvalidation } from "@/hooks/use-cache-invalidation";

interface CacheInvalidationProviderProps {
  children: React.ReactNode;
}

export function CacheInvalidationProvider({ children }: CacheInvalidationProviderProps) {
  // Usar el hook de invalidación de caché
  useCacheInvalidation();

  // Este componente no renderiza nada, solo ejecuta la lógica de invalidación
  return <>{children}</>;
} 