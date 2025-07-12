import { NextRequest, NextResponse } from "next/server";
import { SpotifyService } from "@/services/SpotifyService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: albumId } = await params;
    
    if (!albumId) {
      return NextResponse.json({ error: "ID de álbum requerido" }, { status: 400 });
    }

    const spotifyService = new SpotifyService();
    
    // Obtener información del álbum y sus canciones
    const [albumDetails, albumTracks] = await Promise.all([
      spotifyService.getAlbumDetails(albumId),
      spotifyService.getAlbumTracks(albumId)
    ]);

    // Combinar la información del álbum con las canciones
    const albumWithTracks = {
      ...albumDetails,
      tracks: albumTracks
    };

    return NextResponse.json(albumWithTracks);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
} 