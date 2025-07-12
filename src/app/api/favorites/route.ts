import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/di/container";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const favoriteUseCases = container.createFavoriteUseCases(session.user.id);
    const favorites = await favoriteUseCases.getFavorites();
    
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('[Favorites API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
} 