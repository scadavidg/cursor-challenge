import { z } from "zod";

// Validación de entrada para prevenir inyecciones
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres peligrosos
    .slice(0, 1000); // Limitar longitud
};

// Validación de email
export const emailSchema = z
  .string()
  .email("Email inválido")
  .min(1, "Email es requerido")
  .max(255, "Email demasiado largo");

// Validación de contraseña
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña es demasiado larga")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo");

// Validación de nombre
export const nameSchema = z
  .string()
  .min(1, "El nombre es requerido")
  .max(100, "El nombre es demasiado largo")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios");

// Rate limiting helper
export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.limit) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemaining(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record) return this.limit;
    return Math.max(0, this.limit - record.count);
  }
}

// Validación de ID de álbum
export const albumIdSchema = z
  .string()
  .min(1, "ID de álbum es requerido")
  .max(50, "ID de álbum demasiado largo")
  .regex(/^[a-zA-Z0-9_-]+$/, "ID de álbum inválido");

// Sanitización de datos de álbum
export const sanitizeAlbumData = (album: any) => {
  return {
    id: sanitizeInput(album.id || ''),
    title: sanitizeInput(album.title || ''),
    artist: sanitizeInput(album.artist || ''),
    coverArt: album.coverArt || '',
  };
}; 