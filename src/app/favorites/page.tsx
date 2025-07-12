import { FavoritesList } from "@/components/albums/favorites-list";
import { FavoritesStats } from "@/components/albums/favorites-stats";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
          Tus Favoritos
        </h1>
        <p className="text-lg text-muted-foreground">
          Aquí están tus álbumes guardados.
        </p>
      </div>
      
      <div className="mb-8">
        <FavoritesStats />
      </div>
      
      <FavoritesList />
    </div>
  );
} 