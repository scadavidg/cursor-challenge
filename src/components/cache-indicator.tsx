"use client";

import { Badge } from '@/components/ui/badge';
import { Database, HardDrive } from 'lucide-react';

interface CacheIndicatorProps {
  isFromCache: boolean;
  cacheType?: 'memory' | 'storage';
  className?: string;
}

export function CacheIndicator({ 
  isFromCache, 
  cacheType = 'memory', 
  className = '' 
}: CacheIndicatorProps) {
  if (!isFromCache) return null;

  return (
    <Badge 
      variant="secondary" 
      className={`text-xs flex items-center gap-1 ${className}`}
    >
      {cacheType === 'memory' ? (
        <HardDrive className="h-3 w-3" />
      ) : (
        <Database className="h-3 w-3" />
      )}
      {cacheType === 'memory' ? 'Memory' : 'Storage'} Cache
    </Badge>
  );
} 