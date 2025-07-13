import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/di/container";
import type { Album } from "@/lib/types";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const album: Album = body.album;

    if (!album || !album.id) {
      return NextResponse.json({ error: "Datos de álbum inválidos" }, { status: 400 });
    }

    const favoriteUseCases = container.createFavoriteUseCases(session.user.id);
    await favoriteUseCases.addFavorite(album);
    
    return createApiResponse({ message: "Álbum agregado a favoritos" });
  } catch (error) {
    return createErrorResponse(error, 500, 'Add Favorite API');
  }
} 