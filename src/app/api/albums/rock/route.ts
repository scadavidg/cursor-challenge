import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/di/container";
import { RockKeywordService } from '@/services/RockKeywordService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const albumUseCases = container.getAlbumUseCases();
    const keywords = await RockKeywordService.getAllKeywords();

    // Paginado inteligente: buscar hasta 'limit' álbumes válidos
    let filteredAlbums: any[] = [];
    let currentPage = page;
    let fetched = 0;
    let keepFetching = true;
    const maxAttempts = 10; // Evita loops infinitos
    let attempts = 0;

    while (filteredAlbums.length < limit && keepFetching && attempts < maxAttempts) {
      const albums = await albumUseCases.getRockAlbums(currentPage, limit);
      if (!albums || albums.length === 0) {
        keepFetching = false;
        break;
      }
      const valid = albums.filter(album => {
        const albumTitle = album.title.toLowerCase();
        const artistName = album.artist.toLowerCase();
        return keywords.some(keyword => albumTitle.includes(keyword) || artistName.includes(keyword));
      });
      filteredAlbums = filteredAlbums.concat(valid);
      if (albums.length < limit) {
        // Ya no hay más en la fuente
        keepFetching = false;
      } else {
        currentPage++;
      }
      attempts++;
    }

    // Solo devolver hasta 'limit' álbumes
    const paginatedAlbums = filteredAlbums.slice(0, limit);
    return NextResponse.json({ albums: paginatedAlbums, page, limit });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error interno del servidor" }, { status: 500 });
  }
} 