"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cacheManager } from '@/lib/cache';
import { RefreshCw, Trash2, Database, HardDrive } from 'lucide-react';

export function CacheDebugPanel() {
  const [stats, setStats] = useState(cacheManager.getStats());
  const [isVisible, setIsVisible] = useState(false);

  const updateStats = () => {
    setStats(cacheManager.getStats());
  };

  useEffect(() => {
    // Actualizar stats cada 5 segundos
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    await cacheManager.clear();
    updateStats();
  };

  const handleRefreshStats = () => {
    updateStats();
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Database className="h-4 w-4 mr-2" />
        Cache Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-sm border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Cache Debug Panel</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center">
              <HardDrive className="h-3 w-3 mr-1" />
              Memory Cache
            </span>
            <Badge variant="secondary" className="text-xs">
              {stats.memoryItems}/{stats.maxMemoryItems}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center">
              <Database className="h-3 w-3 mr-1" />
              Local Storage
            </span>
            <Badge variant="outline" className="text-xs">
              {stats.storageItems} items
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStats}
            className="flex-1 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearCache}
            className="flex-1 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 