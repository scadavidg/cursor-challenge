import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/AuthService";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";

/**
 * @swagger
 * /api/verify-auth:
 *   get:
 *     summary: Verificar autenticación del usuario
 *     description: Verifica si el usuario está autenticado y devuelve sus datos
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyAuthResponse'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function GET(request: NextRequest) {
  try {
    // Obtener el token del header Authorization
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ isAuthenticated: false, message: "No autenticado" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ isAuthenticated: false, message: "No autenticado" }, { status: 401 });
    }
    const authService = new AuthService();
    const payload = await authService.verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ isAuthenticated: false, message: "Token inválido" }, { status: 401 });
    }
    const userRepository = new UserRepository();
    const user = await userRepository.findByEmail(payload.email);
    if (!user) {
      return NextResponse.json({ isAuthenticated: false, message: "Usuario no encontrado" }, { status: 404 });
    }
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false, error: error instanceof Error ? error.message : "Error interno del servidor" }, { status: 500 });
  }
} 