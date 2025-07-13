import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Skeleton específico para tarjetas de álbumes
function AlbumCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col overflow-hidden h-full", className)}>
      {/* Skeleton para la imagen */}
      <div className="w-full aspect-square bg-muted animate-pulse" />
      
      {/* Skeleton para el contenido */}
      <div className="p-4 flex-1 space-y-2">
        <div className="h-5 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
      </div>
      
      {/* Skeleton para el footer */}
      <div className="p-4 pt-0">
        <div className="h-9 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}

// Skeleton para grid de álbumes
function AlbumGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <AlbumCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Skeleton para detalles de álbum
function AlbumDetailsSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto px-2 sm:px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Skeleton para la imagen del álbum */}
        <div className="flex-shrink-0 flex justify-center md:block w-full md:w-auto">
          <div className="w-[300px] h-[300px] bg-muted rounded-lg animate-pulse" />
        </div>
        
        {/* Skeleton para la información del álbum */}
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded w-2/3 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-muted rounded w-24 animate-pulse" />
            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Skeleton para la lista de canciones */}
      <div className="space-y-3">
        <div className="h-6 bg-muted rounded w-48 animate-pulse" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
            </div>
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton para estadísticas
function StatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
      <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
    </div>
  )
}

// Skeleton para formularios de autenticación
function AuthFormSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2 text-center">
        <Skeleton className="h-4 w-48 mx-auto" />
        <Skeleton className="h-3 w-32 mx-auto" />
      </div>
    </div>
  )
}

export { Skeleton, AlbumCardSkeleton, AlbumGridSkeleton, AlbumDetailsSkeleton, StatsSkeleton, AuthFormSkeleton }
