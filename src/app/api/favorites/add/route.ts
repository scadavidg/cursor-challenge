import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/di/container";
import type { Album } from "@/lib/types";

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
    
    return NextResponse.json({ 
      message: "Álbum agregado a favoritos",
      album 
    });
  } catch (error) {
    console.error('[Add Favorite API] Error:', error);
    
    if (error instanceof Error && error.message.includes("ya está en tus favoritos")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
} 