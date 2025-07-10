"use client";

import { useState } from "react";
import { AlbumSearch } from "@/components/albums/album-search";
import { FeaturedAlbums } from "@/components/albums/featured-albums";
import { Button } from "@/components/ui/button";
import { Search, Music } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'search' | 'explore'>('explore');

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-2">
          Descubre tu próximo álbum favorito
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Explora nuestra colección de rock o busca álbumes específicos.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === 'explore' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2"
          >
            <Music className="h-4 w-4" />
            Explorar todos los álbumes
          </Button>
          <Button
            variant={activeTab === 'search' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar álbumes
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'explore' ? (
        <FeaturedAlbums 
          title="Álbumes destacados" 
          description="Desplázate hacia abajo para descubrir más álbumes de rock. ¡Haz clic en el ícono de corazón para agregarlos a tus favoritos!"
        />
      ) : (
        <AlbumSearch />
      )}
    </div>
  );
} 