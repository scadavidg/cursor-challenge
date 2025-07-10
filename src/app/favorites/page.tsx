import { FavoritesList } from "@/components/albums/favorites-list";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
          Your Favorites
        </h1>
        <p className="text-lg text-muted-foreground">
          Here are your saved albums.
        </p>
      </div>
      <FavoritesList />
    </div>
  );
} 