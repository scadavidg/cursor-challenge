import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll<T>(
  loadMore: (page: number) => Promise<{ data: T[]; hasMore: boolean; page: number }>,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const loadMoreData = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loadMore(page);
      // Validación robusta:
      const safeResult = result && Array.isArray(result.data)
        ? result
        : { data: [], hasMore: false, page };
      setData(prev => [...prev, ...safeResult.data]);
      setHasMore(safeResult.hasMore);
      setPage(safeResult.page + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more data');
    } finally {
      setIsLoading(false);
    }
  }, [loadMore, page, isLoading, hasMore]);

  // Memoize the observer callback to prevent unnecessary re-renders
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      loadMoreData();
    }
  }, [hasMore, isLoading, loadMoreData]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled || !loadingRef.current) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    observerRef.current = observer;
    observer.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [observerCallback, threshold, rootMargin, enabled]);

  return {
    data,
    isLoading,
    error,
    hasMore,
    loadMore: loadMoreData,
    reset,
    loadingRef,
  };
} 