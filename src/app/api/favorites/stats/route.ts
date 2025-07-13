import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { FavoriteRepository } from "@/infrastructure/repositories/FavoriteRepository";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRepo = new UserRepository();
  const user = await userRepo.findByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const favoriteRepo = new FavoriteRepository(user.id);
  const favorites = await favoriteRepo.getFavorites();

  const totalFavorites = favorites.length;
  const uniqueArtists = new Set(favorites.map(fav => fav.artist)).size;

  return NextResponse.json({
    totalFavorites,
    uniqueArtists
  });
} 