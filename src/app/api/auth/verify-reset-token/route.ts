import { NextRequest, NextResponse } from "next/server";
import { PasswordResetUseCases } from "@/domain/usecases/PasswordResetUseCases";
import { PasswordResetService } from "@/services/PasswordResetService";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

/**
 * @swagger
 * /api/auth/verify-reset-token:
 *   get:
 *     summary: Verificar token de reset
 *     description: Verifica si un token de reset de contraseña es válido
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de reset de contraseña
 *     responses:
 *       200:
 *         description: Token verificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    
    if (!email || !token) {
      return createErrorResponse(
        new Error("Email y token son requeridos"), 
        400, 
        'Verify Reset Token API'
      );
    }
    
    const passwordResetUseCases = new PasswordResetUseCases(
      new PasswordResetService()
    );
    
    const isValid = await passwordResetUseCases.verifyResetToken(email, token);
    
    return createApiResponse({
      valid: isValid
    });
  } catch (error) {
    return createErrorResponse(error, 500, 'Verify Reset Token API');
  }
} 