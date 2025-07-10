import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { HashService } from "@/services/HashService";
import { AuthService } from "@/services/AuthService";
import { AuthUseCases } from "@/domain/usecases/AuthUseCases";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authUseCases = new AuthUseCases(
      new UserRepository(),
      new HashService(),
      new AuthService()
    );
    const { user, token } = await authUseCases.login(body);
    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 400 }
    );
  }
} 