import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/di/container";
import { RockKeywordService } from '@/services/RockKeywordService';
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";
import { sanitizeInput } from "@/lib/security";

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
    const query = sanitizeInput(searchParams.get("query") || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    // Verificar si el término es de rock usando la base de datos
    const isRock = await RockKeywordService.isRockKeyword(query);
    if (!query.trim() || !isRock) {
      // Mensaje gracioso si no es rock
      const funMessage = ROCK_MESSAGES[Math.floor(Math.random() * ROCK_MESSAGES.length)];
      return createApiResponse({ albums: [], page, limit, funMessage });
    }
    const albumUseCases = container.getAlbumUseCases();
    const albums = await albumUseCases.searchRockAlbums(query, page, limit);
    return createApiResponse({ albums, page, limit });
  } catch (error) {
    return createErrorResponse(error, 500, 'Albums Search API');
  }
} 