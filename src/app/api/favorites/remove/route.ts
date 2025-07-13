import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/di/container";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get("albumId");

    if (!albumId) {
      return NextResponse.json({ error: "ID de álbum requerido" }, { status: 400 });
    }

    const favoriteUseCases = container.createFavoriteUseCases(session.user.id);
    await favoriteUseCases.removeFavorite(albumId);
    
    return createApiResponse({ message: "Álbum eliminado de favoritos" });
  } catch (error) {
    return createErrorResponse(error, 500, 'Remove Favorite API');
  }
} 