import { PasswordResetService } from "@/services/PasswordResetService";
import { RequestPasswordResetInput, ResetPasswordInput, requestPasswordResetSchema, resetPasswordSchema } from "../validators/passwordResetValidator";

export class PasswordResetUseCases {
  constructor(private passwordResetService: PasswordResetService) {}

  async requestPasswordReset(input: RequestPasswordResetInput): Promise<void> {
    const validated = requestPasswordResetSchema.parse(input);
    await this.passwordResetService.generateResetToken(validated.email);
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const validated = resetPasswordSchema.parse(input);
    return await this.passwordResetService.resetPassword(
      validated.email,
      validated.token,
      validated.password
    );
  }

  async verifyResetToken(email: string, token: string): Promise<boolean> {
    return await this.passwordResetService.verifyResetToken(email, token);
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.passwordResetService.cleanupExpiredTokens();
  }
} 