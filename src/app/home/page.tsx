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
          Discover Your Next Favorite Album
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Explore our collection or search for specific albums.
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
            Explore All Albums
          </Button>
          <Button
            variant={activeTab === 'search' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Albums
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'explore' ? (
        <FeaturedAlbums 
          title="Featured Albums" 
          description="Scroll down to discover more albums from our collection. Click the heart icon to add albums to your favorites!"
        />
      ) : (
        <AlbumSearch />
      )}
    </div>
  );
} 