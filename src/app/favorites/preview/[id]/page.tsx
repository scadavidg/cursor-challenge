"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { AlbumPreviewContent } from "@/components/albums/album-preview-content";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { AlbumDetails } from "@/lib/types";
import { useDeezerPreviews } from "@/hooks/use-deezer-previews";
import { useAlbumCache } from "@/hooks/use-album-cache";

export default function AlbumPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = React.useState<{
    url: string;
    trackName: string;
    source: string;
  } | null>(null);
  const [songsBeingLoaded, setSongsBeingLoaded] = React.useState<string[]>([]);

  // Hook para caché de álbumes
  const { 
    albumDetails, 
    loading, 
    error, 
    fetchAlbumDetails, 
    invalidateCache, 
    isFromCache: albumFromCache 
  } = useAlbumCache();

  // Hook para previews alternativos (Deezer)
  const { 
    previews, 
    isLoading: deezerLoading, 
    fetchPreviews, 
    isFromCache: deezerFromCache 
  } = useDeezerPreviews();

  const { id } = React.use(params);

  const handleFetchAlbumDetails = async () => {
    const details = await fetchAlbumDetails(id);
    
    // Buscar previews alternativos en Deezer si es necesario
    // Usar el resultado de fetchAlbumDetails en lugar del estado
    if (details) {
      const songsWithoutPreview = details.tracks.items
        .filter((track: any) => !track.preview_url)
        .map((track: any) => track.name);
      if (songsWithoutPreview.length > 0) {
        setSongsBeingLoaded(songsWithoutPreview);
        await fetchPreviews(songsWithoutPreview);
        setSongsBeingLoaded([]);
      }
    }
  };

  React.useEffect(() => {
    handleFetchAlbumDetails();
    // eslint-disable-next-line
  }, [id]);

  // Limpiar estado de reproducción cuando se desmonta el componente
  React.useEffect(() => {
    return () => {
      setCurrentlyPlaying(null);
      setSelectedPreview(null);
    };
  }, []);

  const getPreviewUrl = (track: any) => {
    if (track.preview_url) return track.preview_url;
    return previews[track.name] || null;
  };

  const getPreviewSource = (track: any) => {
    if (track.preview_url) return "Spotify";
    if (previews[track.name]) return "Deezer";
    return null;
  };

  const handleSelectPreview = (track: any) => {
    const previewUrl = getPreviewUrl(track);
    const previewSource = getPreviewSource(track);
    if (previewUrl) {
      // Si hay una canción reproduciéndose, detenerla primero
      if (currentlyPlaying && currentlyPlaying !== track.name) {
        setCurrentlyPlaying(null);
      }
      
      setSelectedPreview({ url: previewUrl, trackName: track.name, source: previewSource || "" });
      // Iniciar reproducción de la nueva canción
      setCurrentlyPlaying(track.name);
    }
  };
  
  const handleTogglePlay = (trackName: string) => {
    if (currentlyPlaying === trackName) {
      // Pausar la canción actual
      setCurrentlyPlaying(null);
    } else {
      // Si hay otra canción reproduciéndose, detenerla y reproducir la nueva
      if (currentlyPlaying && currentlyPlaying !== trackName) {
        setCurrentlyPlaying(null);
        // Pequeño delay para asegurar que se detenga antes de iniciar la nueva
        setTimeout(() => setCurrentlyPlaying(trackName), 50);
      } else {
        setCurrentlyPlaying(trackName);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <div className="sticky top-0 z-40 bg-background/95 p-2 flex items-center gap-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.push('/favorites')} aria-label="Volver">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-bold text-lg">Preview</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AlbumPreviewContent
          albumDetails={albumDetails}
          loading={loading}
          error={error}
          deezerLoading={deezerLoading}
          songsBeingLoaded={songsBeingLoaded}
          selectedPreview={selectedPreview}
          currentlyPlaying={currentlyPlaying}
          onSelectPreview={handleSelectPreview}
          onTogglePlay={handleTogglePlay}
          fetchAlbumDetails={() => handleFetchAlbumDetails()}
          getPreviewUrl={getPreviewUrl}
          getPreviewSource={getPreviewSource}
          albumFromCache={albumFromCache}
          deezerFromCache={deezerFromCache}
        />
      </div>
    </div>
  );
} 