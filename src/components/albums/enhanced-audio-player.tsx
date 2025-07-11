"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Volume1, Volume } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EnhancedAudioPlayerProps {
  previewUrl: string | null;
  trackName: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function EnhancedAudioPlayer({ 
  previewUrl, 
  trackName, 
  className,
  isPlaying,
  onTogglePlay
}: EnhancedAudioPlayerProps) {
  const [isMuted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevUrlRef = useRef<string | null>(null);

  // Reproducir automáticamente cuando cambie el previewUrl y isPlaying sea true
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (previewUrl && previewUrl !== prevUrlRef.current) {
      audio.currentTime = 0;
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
      prevUrlRef.current = previewUrl;
    }
  }, [previewUrl]);

  // Controlar play/pause desde isPlaying
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setCurrentTime(0);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleMute = () => {
    setMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (newVolume === 0) {
      setMuted(true);
    } else if (isMuted) {
      setMuted(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Elegir ícono de volumen según el estado
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.33) return <Volume className="h-4 w-4" />;
    if (volume < 0.66) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  if (!previewUrl) {
    return (
      <div className={cn("flex items-center gap-2 p-2 bg-muted/30 rounded-lg", className)}>
        <span className="text-sm text-muted-foreground">Preview no disponible</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 p-2 bg-muted/50 rounded-lg", className)}>
      <audio ref={audioRef} src={previewUrl} preload="metadata" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePlay}
        className="h-8 w-8 p-0 flex-shrink-0"
        title={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate" title={trackName}>
          {trackName}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex-shrink-0">{formatTime(currentTime)}</span>
          <div className="flex-1 bg-muted rounded-full h-1 min-w-0">
            <div 
              className="bg-primary h-1 rounded-full transition-all"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="flex-shrink-0">{formatTime(duration)}</span>
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0"
            title={isMuted ? "Activar sonido" : "Ajustar volumen"}
            aria-label="Ajustar volumen"
            tabIndex={0}
            type="button"
          >
            {getVolumeIcon()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground mb-1">Volumen</span>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-full"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 