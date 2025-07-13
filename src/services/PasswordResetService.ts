import crypto from 'crypto';
import { prisma } from '@/infrastructure/db/prisma';
import { EmailService } from './EmailService';
import { HashService } from './HashService';
import { logger } from '@/lib/logger';

export class PasswordResetService {
  private emailService: EmailService;
  private hashService: HashService;

  constructor() {
    this.emailService = new EmailService();
    this.hashService = new HashService();
  }

  async generateResetToken(email: string): Promise<string> {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return 'token_generated'; // Retornar un token falso para no revelar información
    }

    // Eliminar cualquier token anterior para este email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await this.hashService.hash(resetToken);

    // Calcular fecha de expiración (1 hora)
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar token en la base de datos
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    // Enviar email
    try {
      await this.emailService.sendPasswordResetEmail(
        email, 
        resetToken, 
        user.name || 'Usuario'
      );
    } catch (error) {
      // Si falla el envío de email, eliminar el token
      await prisma.verificationToken.deleteMany({
        where: { identifier: email }
      });
      throw error;
    }

    return 'token_generated';
  }

  async verifyResetToken(email: string, token: string): Promise<boolean> {
    try {
      // Buscar el token en la base de datos
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: email,
          expires: { gt: new Date() }
        }
      });

      if (!verificationToken) {
        return false;
      }

      // Verificar el token
      const isValid = await this.hashService.compare(token, verificationToken.token);
      return isValid;
    } catch (error) {
      return false;
    }
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<boolean> {
    try {
      // Verificar el token
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: email,
          expires: { gt: new Date() }
        }
      });
      if (!verificationToken) {
        return false;
      }
      const isValid = await this.hashService.compare(token, verificationToken.token);
      if (!isValid) {
        return false;
      }

      // Buscar el usuario
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true }
      });

      if (!user) {
        return false;
      }

      // Hashear la nueva contraseña
      const hashedPassword = await this.hashService.hash(newPassword);

      // Actualizar la contraseña
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

      // Eliminar el token usado
      await prisma.verificationToken.delete({
        where: { 
          identifier_token: {
            identifier: email,
            token: verificationToken.token
          }
        }
      });

      // Enviar email de confirmación
      try {
        await this.emailService.sendPasswordChangedEmail(
          email, 
          user.name || 'Usuario'
        );
      } catch (error) {
        // No fallar si el email de confirmación falla
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    try {
      await prisma.verificationToken.deleteMany({
        where: {
          expires: { lt: new Date() }
        }
      });
      logger.info('Expired verification tokens cleaned up', 'PasswordResetService');
    } catch (error) {
      logger.error('Error cleaning up expired tokens:', 'PasswordResetService', error);
    }
  }
} 