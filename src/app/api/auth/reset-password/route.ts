import { NextRequest, NextResponse } from "next/server";
import { PasswordResetUseCases } from "@/domain/usecases/PasswordResetUseCases";
import { PasswordResetService } from "@/services/PasswordResetService";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Resetear contraseña
 *     description: Cambia la contraseña usando un token válido
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *               token:
 *                 type: string
 *                 description: Token de reset de contraseña
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Nueva contraseña
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmación de la nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos o token expirado
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const passwordResetUseCases = new PasswordResetUseCases(
      new PasswordResetService()
    );
    
    const success = await passwordResetUseCases.resetPassword(body);
    
    if (!success) {
      return createErrorResponse(
        new Error("Token inválido o expirado"), 
        400, 
        'Reset Password API'
      );
    }
    
    return createApiResponse({
      message: "Contraseña cambiada exitosamente. Recibirás un email de confirmación."
    });
  } catch (error) {
    return createErrorResponse(error, 400, 'Reset Password API');
  }
} 