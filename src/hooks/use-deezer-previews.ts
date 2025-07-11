import { useState, useCallback } from "react";

interface UseDeezerPreviewsReturn {
  previews: Record<string, string | null>;
  isLoading: boolean;
  error: string | null;
  fetchPreviews: (songNames: string[]) => Promise<void>;
  clearPreviews: () => void;
}

export function useDeezerPreviews(): UseDeezerPreviewsReturn {
  const [previews, setPreviews] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreviews = useCallback(async (songNames: string[]) => {
    if (songNames.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/previews/deezer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songNames }),
      });

      if (!response.ok) {
        throw new Error("Error al obtener previews de Deezer");
      }

      const data = await response.json();
      
      // Crear un objeto con los nombres de canciones como claves
      const previewsMap: Record<string, string | null> = {};
      songNames.forEach((songName, index) => {
        previewsMap[songName] = data.previews[index] || null;
      });

      setPreviews(prev => ({ ...prev, ...previewsMap }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching Deezer previews:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPreviews = useCallback(() => {
    setPreviews({});
    setError(null);
  }, []);

  return {
    previews,
    isLoading,
    error,
    fetchPreviews,
    clearPreviews,
  };
} 