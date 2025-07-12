import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FavoriteUseCases } from "@/domain/usecases/FavoriteUseCases";

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

    const favoriteUseCases = new FavoriteUseCases();
    await favoriteUseCases.removeFromFavorites(session.user.id, albumId);
    
    return NextResponse.json({ 
      message: "Álbum removido de favoritos",
      albumId 
    });
  } catch (error) {
    console.error("Error al remover favorito:", error);
    
    if (error instanceof Error && error.message.includes("no estaba en tus favoritos")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
} 