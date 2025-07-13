import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<void> {
    // Incluir el email en el enlace de recuperación
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: `"RockStack" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña - RockStack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎸 RockStack</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Recuperación de Contraseña</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hemos recibido una solicitud para restablecer tu contraseña en RockStack. 
              Si no solicitaste este cambio, puedes ignorar este correo.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🔐 Restablecer Contraseña
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            
            <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #495057;">
              ${resetUrl}
            </p>
            
            <div style="border-top: 1px solid #dee2e6; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Este enlace expirará en 1 hora por seguridad.
              </p>
              <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                Si tienes problemas, contacta a nuestro equipo de soporte.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`, 'EmailService');
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, 'EmailService', error);
      throw new Error('Error al enviar el correo de recuperación');
    }
  }

  async sendPasswordChangedEmail(email: string, userName: string): Promise<void> {
    const mailOptions = {
      from: `"RockStack" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Contraseña Cambiada - RockStack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎸 RockStack</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Contraseña Actualizada</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Tu contraseña ha sido cambiada exitosamente. Si no realizaste este cambio, 
              contacta inmediatamente a nuestro equipo de soporte.
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>✅ Contraseña actualizada correctamente</strong>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Puedes acceder a tu cuenta con tu nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/login" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🎵 Ir a RockStack
              </a>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Si no realizaste este cambio, contacta inmediatamente a nuestro equipo.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password changed confirmation email sent to ${email}`, 'EmailService');
    } catch (error) {
      logger.error(`Failed to send password changed email to ${email}:`, 'EmailService', error);
      // No lanzar error aquí ya que el cambio de contraseña ya se realizó
    }
  }
} 