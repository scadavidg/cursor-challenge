import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FavoriteUseCases } from "@/domain/usecases/FavoriteUseCases";

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

    const favoriteUseCases = new FavoriteUseCases();
    const isFavorite = await favoriteUseCases.isFavorite(session.user.id, albumId);
    
    return NextResponse.json({ isFavorite });
  } catch (error) {
    return NextResponse.json({ isFavorite: false });
  }
} 