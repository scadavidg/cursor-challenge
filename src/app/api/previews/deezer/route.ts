import { NextRequest, NextResponse } from "next/server";
import { DeezerService } from "@/services/DeezerService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songNames }: { songNames: string[] } = body;

    if (!songNames || !Array.isArray(songNames)) {
      return NextResponse.json({ error: "Lista de nombres de canciones requerida" }, { status: 400 });
    }

    const deezerService = new DeezerService();
    const previews: (string | null)[] = [];

    // Consultar Deezer por cada canción
    for (const songName of songNames) {
      try {
        console.log(`🎵 Buscando preview para: ${songName}`);
        const preview = await deezerService.getTrackPreview(songName);
        
        if (preview) {
          previews.push(preview);
          console.log(`✅ Preview encontrado para "${songName}": ${preview}`);
        } else {
          previews.push(null);
          console.log(`❌ No se encontró preview para "${songName}"`);
        }
      } catch (error) {
        console.error(`Error buscando preview para "${songName}":`, error);
        previews.push(null);
      }
    }

    return NextResponse.json({ previews });
  } catch (error) {
    console.error("Error al obtener previews de Deezer:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
} 