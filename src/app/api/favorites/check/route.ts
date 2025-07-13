import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/di/container";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false });
    }

    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get("albumId");

    if (!albumId) {
      return NextResponse.json({ error: "ID de álbum requerido" }, { status: 400 });
    }

    const favoriteUseCases = container.createFavoriteUseCases(session.user.id);
    const isFavorite = await favoriteUseCases.checkFavorite(albumId);
    
    return createApiResponse({ isFavorite });
  } catch (error) {
    return createErrorResponse(error, 500, 'Check Favorite API');
  }
} 