import { NextRequest, NextResponse } from "next/server";
import { AlbumUseCases } from "@/domain/usecases/AlbumUseCases";
import { RockKeywordService } from '@/services/RockKeywordService';

const ROCK_MESSAGES = [
  "¡Solo aceptamos rock! Intenta con algo más ruidoso 🤘",
  "¿Pop? ¿Reggaetón? Aquí solo suena el rock, baby.",
  "¡Eso no es rock! Prueba con AC/DC, Queen o Nirvana.",
  "¡Ups! Este escenario es solo para rockstars. Busca algo más rockero.",
  "¡Prohibido el reggaetón! Aquí solo guitarras eléctricas y baterías.",
  "¡No encontramos nada! Pero si fuera rock, seguro sí. 🤟",
  "¡Eso no es suficientemente ruidoso! Solo aceptamos rock del bueno.",
  "¿Intentando colar algo que no es rock? ¡No en mi guardia!",
  "¡Aquí solo se permiten riffs y solos de guitarra!",
  "¡Eso no es rock! Pero puedes intentarlo con Led Zeppelin, The Beatles o Pink Floyd."
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    // Verificar si el término es de rock usando la base de datos
    const isRock = await RockKeywordService.isRockKeyword(query);
    if (!query.trim() || !isRock) {
      // Mensaje gracioso si no es rock
      const funMessage = ROCK_MESSAGES[Math.floor(Math.random() * ROCK_MESSAGES.length)];
      return NextResponse.json({ albums: [], page, limit, funMessage });
    }
    const albumUseCases = new AlbumUseCases();
    const albums = await albumUseCases.searchRockAlbums(query, page, limit);
    return NextResponse.json({ albums, page, limit });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error interno del servidor" }, { status: 500 });
  }
}

export default { GET }; 