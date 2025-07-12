"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { AlbumPreviewContent } from "@/components/albums/album-preview-content";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { AlbumDetails } from "@/lib/types";
import { useDeezerPreviews } from "@/hooks/use-deezer-previews";

export default function AlbumPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [albumDetails, setAlbumDetails] = React.useState<AlbumDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = React.useState<{
    url: string;
    trackName: string;
    source: string;
  } | null>(null);

  // Hook para previews alternativos (Deezer)
  const { previews, isLoading: deezerLoading, fetchPreviews } = useDeezerPreviews();

  const { id } = React.use(params);

  const fetchAlbumDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/albums/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar el álbum");
      const data = await res.json();
      setAlbumDetails(data);
      // Buscar previews alternativos en Deezer si es necesario
      const songsWithoutPreview = data.tracks.items
        .filter((track: any) => !track.preview_url)
        .map((track: any) => track.name);
      if (songsWithoutPreview.length > 0) {
        await fetchPreviews(songsWithoutPreview);
      }
    } catch (err) {
      setError("No se pudo cargar el álbum");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAlbumDetails();
    // eslint-disable-next-line
  }, [id]);

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
      setSelectedPreview({ url: previewUrl, trackName: track.name, source: previewSource || "" });
      setCurrentlyPlaying(track.name);
    }
  };
  const handleTogglePlay = (trackName: string) => {
    if (currentlyPlaying === trackName) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackName);
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
          selectedPreview={selectedPreview}
          currentlyPlaying={currentlyPlaying}
          onSelectPreview={handleSelectPreview}
          onTogglePlay={handleTogglePlay}
          fetchAlbumDetails={fetchAlbumDetails}
          getPreviewUrl={getPreviewUrl}
          getPreviewSource={getPreviewSource}
        />
      </div>
    </div>
  );
} 