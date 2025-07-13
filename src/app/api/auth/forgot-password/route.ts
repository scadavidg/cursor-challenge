import { NextRequest, NextResponse } from "next/server";
import { PasswordResetUseCases } from "@/domain/usecases/PasswordResetUseCases";
import { PasswordResetService } from "@/services/PasswordResetService";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar reset de contraseña
 *     description: Envía un email con un enlace para restablecer la contraseña
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const passwordResetUseCases = new PasswordResetUseCases(
      new PasswordResetService()
    );
    
    await passwordResetUseCases.requestPasswordReset(body);
    
    return createApiResponse({
      message: "Si el email existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña."
    });
  } catch (error) {
    return createErrorResponse(error, 400, 'Forgot Password API');
  }
} 