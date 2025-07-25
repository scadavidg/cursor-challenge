import Image from "next/image";
import { Loader2, Music, Calendar, Disc3, ExternalLink, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EnhancedAudioPlayer } from "./enhanced-audio-player";
import { AlbumDetailsSkeleton, PreviewListSkeleton } from "@/components/ui/skeleton";
import type { AlbumDetails, Track } from "@/lib/types";
import { SpotifyIcon } from "@/components/ui/spotify-icon";
import { DeezerIcon } from "@/components/ui/deezer-icon";
import { EqualizerBars } from "@/components/ui/equalizer-bars";
import { CacheIndicator } from "@/components/cache-indicator";

interface AlbumPreviewContentProps {
  albumDetails: AlbumDetails | null;
  loading: boolean;
  error: string | null;
  deezerLoading?: boolean;
  songsBeingLoaded?: string[];
  selectedPreview: { url: string; trackName: string; source: string } | null;
  currentlyPlaying: string | null;
  onSelectPreview: (track: Track) => void;
  onTogglePlay: (trackName: string) => void;
  fetchAlbumDetails: () => void;
  getPreviewUrl: (track: Track) => string | null;
  getPreviewSource: (track: Track) => string | null;
  albumFromCache?: boolean;
  deezerFromCache?: boolean;
}

export function AlbumPreviewContent({
  albumDetails,
  loading,
  error,
  deezerLoading,
  songsBeingLoaded = [],
  selectedPreview,
  currentlyPlaying,
  onSelectPreview,
  onTogglePlay,
  fetchAlbumDetails,
  getPreviewUrl,
  getPreviewSource,
  albumFromCache = false,
  deezerFromCache = false,
}: AlbumPreviewContentProps) {
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

  if (loading) {
    return <AlbumDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchAlbumDetails} variant="outline">
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (!albumDetails) return null;

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto px-2 sm:px-4 py-6">
      {/* Información del álbum */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-shrink-0 flex justify-center md:block w-full md:w-auto">
          <Image
            src={albumDetails.images[0]?.url}
            alt={`Cover art for ${albumDetails.name}`}
            width={300}
            height={300}
            className="rounded-lg shadow-lg mx-auto md:mx-0"
          />
        </div>
        <div className="flex-1 space-y-4 w-full">
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
            <CacheIndicator isFromCache={albumFromCache} cacheType="memory" />
            <CacheIndicator isFromCache={deezerFromCache} cacheType="storage" />
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
                onTogglePlay={() => onTogglePlay(selectedPreview.trackName)}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Preview de <span className="font-semibold">{selectedPreview.trackName}</span> ({selectedPreview.source})
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Lista de canciones */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Music className="h-5 w-5 text-primary" />
          <h4 className="text-xl font-semibold">Canciones</h4>
          <Badge variant="outline">
            {albumDetails.tracks.items.length} canciones
          </Badge>
        </div>
        {deezerLoading ? (
          <PreviewListSkeleton count={albumDetails.tracks.items.length || 8} />
        ) : (
          <ScrollArea className="max-h-[50vh] pr-2 pb-6">
            <div className="space-y-1">
              {albumDetails.tracks.items.map((track: Track) => {
                const previewUrl = getPreviewUrl(track);
                const previewSource = getPreviewSource(track);
                const isSelected = selectedPreview && selectedPreview.trackName === track.name;
                const isCurrentlyPlaying = currentlyPlaying === track.name;
                return (
                  <div
                    key={track.id}
                    className={
                      `flex flex-row items-center p-2 rounded-lg transition-colors cursor-pointer ` +
                      (isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30 hover:bg-muted/50') +
                      (isCurrentlyPlaying ? ' ring-2 ring-primary/50' : '')
                    }
                    onClick={() => {
                      if (isSelected) {
                        onTogglePlay(track.name);
                      } else {
                        onSelectPreview(track);
                      }
                    }}
                  >
                    <span className="text-xs text-muted-foreground w-6 flex-shrink-0 text-center">
                      {track.track_number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block min-w-0 truncate text-sm font-medium">
                        {track.name.length > 30 ? track.name.slice(0, 30) + '...' : track.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {previewSource && (
                        <span className="hidden xs:inline text-xs text-muted-foreground">
                          {previewSource}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(track.duration_ms)}
                      </span>
                      {previewUrl ? (
                        <>
                          {getPreviewSource(track) === "Spotify" && (
                            <a
                              href={track.external_urls?.spotify}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver en Spotify"
                              onClick={e => e.stopPropagation()}
                            >
                              <SpotifyIcon className="w-5 h-5" />
                            </a>
                          )}
                          {getPreviewSource(track) === "Deezer" && (
                            <a
                              href={`https://www.deezer.com/search/${encodeURIComponent(track.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver en Deezer"
                              onClick={e => e.stopPropagation()}
                            >
                              <DeezerIcon className="w-5 h-5" />
                            </a>
                          )}
                          {isCurrentlyPlaying && (
                            <EqualizerBars className="w-5 h-5 text-primary animate-pulse" />
                          )}
                          {isSelected && !isCurrentlyPlaying && (
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            </div>
                          )}
                        </>
                      ) : songsBeingLoaded.includes(track.name) && !track.preview_url ? (
                        // Skeleton para canciones que están esperando previews de Deezer
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="w-4 h-4 bg-muted animate-pulse rounded"></div>
                          <span className="text-xs text-muted-foreground">Cargando...</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          Sin preview
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
} 