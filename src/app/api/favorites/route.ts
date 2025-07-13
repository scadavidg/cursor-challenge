import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { container } from "@/infrastructure/di/container";
import { logger } from "@/lib/logger";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const favoriteUseCases = container.createFavoriteUseCases(session.user.id);
    const allFavorites = await favoriteUseCases.getFavorites();

    // Paginación
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedFavorites = allFavorites.slice(start, end);
    const hasMore = end < allFavorites.length;

    return createApiResponse({
      favorites: paginatedFavorites,
      page,
      limit,
      hasMore
    });
  } catch (error) {
    return createErrorResponse(error, 500, 'Favorites API');
  }
} 