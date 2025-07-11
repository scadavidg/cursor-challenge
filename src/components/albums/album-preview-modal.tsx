"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Music, Calendar, Disc3, ExternalLink, Headphones } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EnhancedAudioPlayer } from "./enhanced-audio-player";
import { useDeezerPreviews } from "@/hooks/use-deezer-previews";
import type { Album, AlbumDetails, Track } from "@/lib/types";

interface AlbumPreviewModalProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlbumPreviewModal({ album, isOpen, onClose }: AlbumPreviewModalProps) {
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<{
    url: string;
    trackName: string;
    source: string;
  } | null>(null);
  
  const { previews, isLoading: deezerLoading, fetchPreviews } = useDeezerPreviews();

  useEffect(() => {
    if (isOpen && album) {
      fetchAlbumDetails();
    } else {
      setAlbumDetails(null);
      setError(null);
      setCurrentlyPlaying(null);
    }
  }, [isOpen, album]);

  const fetchAlbumDetails = async () => {
    if (!album) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/albums/${album.id}`);
      if (!response.ok) {
        throw new Error("Error al cargar los detalles del álbum");
      }
      const data = await response.json();
      setAlbumDetails(data);

      // Obtener previews de Deezer para las canciones que no tienen preview de Spotify
      const songsWithoutPreview = data.tracks.items
        .filter((track: Track) => !track.preview_url)
        .map((track: Track) => track.name);

      if (songsWithoutPreview.length > 0) {
        console.log("🎵 Buscando previews alternativos en Deezer para:", songsWithoutPreview);
        await fetchPreviews(songsWithoutPreview);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePlay = (trackName: string) => {
    if (currentlyPlaying === trackName) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackName);
    }
  };

  const handleSelectPreview = (track: Track) => {
    const previewUrl = getPreviewUrl(track);
    const previewSource = getPreviewSource(track);
    if (previewUrl) {
      setSelectedPreview({ url: previewUrl, trackName: track.name, source: previewSource || "" });
      setCurrentlyPlaying(track.name);
    }
  };

  const getPreviewUrl = (track: Track) => {
    // Primero intentar con Spotify
    if (track.preview_url) {
      return track.preview_url;
    }
    
    // Si no hay preview de Spotify, buscar en Deezer
    return previews[track.name] || null;
  };

  const getPreviewSource = (track: Track) => {
    if (track.preview_url) {
      return "Spotify";
    }
    if (previews[track.name]) {
      return "Deezer";
    }
    return null;
  };

  if (!album) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            {album.title}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando detalles del álbum...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchAlbumDetails} variant="outline">
              Intentar de nuevo
            </Button>
          </div>
        )}

        {albumDetails && !isLoading && (
          <div className="space-y-6">
            {/* Información del álbum */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={albumDetails.images[0]?.url || album.coverArt}
                  alt={`Cover art for ${albumDetails.name}`}
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-3xl font-headline font-bold mb-2">
                    {albumDetails.name}
                  </h3>
                  <p className="text-xl text-muted-foreground">
                    {albumDetails.artists.map(artist => artist.name).join(", ")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatReleaseDate(albumDetails.release_date)}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Disc3 className="h-3 w-3" />
                    {albumDetails.total_tracks} canciones
                  </Badge>
                  {deezerLoading && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Headphones className="h-3 w-3" />
                      Buscando previews alternativos...
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExternalLink(albumDetails.external_urls?.spotify || '')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver en Spotify
                  </Button>
                </div>

                {/* Reproductor global de preview */}
                {selectedPreview && (
                  <div className="mt-4">
                    <EnhancedAudioPlayer
                      previewUrl={selectedPreview.url}
                      trackName={selectedPreview.trackName}
                      className="w-full"
                      isPlaying={!!currentlyPlaying}
                      onTogglePlay={() => setCurrentlyPlaying(currentlyPlaying ? null : selectedPreview.trackName)}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Preview de <span className="font-semibold">{selectedPreview.trackName}</span> ({selectedPreview.source})
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de canciones */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-5 w-5 text-primary" />
                <h4 className="text-xl font-semibold">Canciones</h4>
                <Badge variant="outline">
                  {albumDetails.tracks.items.length} canciones
                </Badge>
              </div>

              <ScrollArea className="h-[400px] pr-4 pb-6">
                <div className="space-y-2">
                  {albumDetails.tracks.items.map((track: Track) => {
                    const previewUrl = getPreviewUrl(track);
                    const previewSource = getPreviewSource(track);
                    const isSelected = selectedPreview && selectedPreview.trackName === track.name;
                    return (
                      <div
                        key={track.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors gap-2"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-sm text-muted-foreground w-8 flex-shrink-0">
                            {track.track_number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{track.name}</p>
                            {previewSource && (
                              <p className="text-xs text-muted-foreground">
                                Preview: {previewSource}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground flex-shrink-0">
                            {formatDuration(track.duration_ms)}
                          </span>
                        </div>
                        <div className="sm:ml-4 flex-shrink-0 flex items-center">
                          {previewUrl ? (
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleSelectPreview(track)}
                              title="Escuchar preview"
                            >
                              <Headphones className="h-5 w-5" />
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Sin preview
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 