import { NextRequest } from 'next/server';
import { POST } from '../route';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { HashService } from '@/services/HashService';
import { AuthService } from '@/services/AuthService';
import { AuthUseCases } from '@/domain/usecases/AuthUseCases';

// Mock dependencies
jest.mock('@/infrastructure/repositories/UserRepository');
jest.mock('@/services/HashService');
jest.mock('@/services/AuthService');
jest.mock('@/domain/usecases/AuthUseCases');

const mockUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;
const mockHashService = HashService as jest.MockedClass<typeof HashService>;
const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;
const mockAuthUseCases = AuthUseCases as jest.MockedClass<typeof AuthUseCases>;

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body),
    } as any;
  };

  describe('successful login', () => {
    it('should return user data and token on successful login', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockToken = 'jwt-token-123';

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(mockUser)
      } as any));

      mockHashService.mockImplementation(() => ({
        compare: jest.fn().mockResolvedValue(true)
      } as any));

      mockAuthService.mockImplementation(() => ({
        generateToken: jest.fn().mockReturnValue(mockToken)
      } as any));

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockResolvedValue({
          user: mockUser,
          token: mockToken
        })
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.message).toBe('Login exitoso');
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      });
      expect(data.token).toBe(mockToken);
      expect(mockAuthUseCases).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle invalid credentials error', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Credenciales inválidas'))
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Credenciales inválidas');
    });

    it('should handle user not found error', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Usuario no encontrado'))
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Usuario no encontrado');
    });

    it('should handle database connection errors', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Error de conexión a la base de datos'))
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Error de conexión a la base de datos');
    });

    it('should handle unknown errors', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue('Unknown error')
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Error interno del servidor');
    });
  });

  describe('request validation', () => {
    it('should handle malformed JSON in request body', async () => {
      // Arrange
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as any;

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid JSON');
    });

    it('should handle missing request body', async () => {
      // Arrange
      const request = {
        json: jest.fn().mockResolvedValue(null)
      } as any;

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Datos de entrada requeridos'))
      } as any));

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Datos de entrada requeridos');
    });
  });

  describe('input validation', () => {
    it('should handle missing email', async () => {
      // Arrange
      const loginData = {
        password: 'password123'
      };

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Email es requerido'))
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Email es requerido');
    });

    it('should handle missing password', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com'
      };

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Contraseña es requerida'))
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Contraseña es requerida');
    });

    it('should handle invalid email format', async () => {
      // Arrange
      const loginData = {
        email: 'invalid-email',
        password: 'password123'
      };

      mockAuthUseCases.mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Formato de email inválido'))
      } as any));

      const request = createMockRequest(loginData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Formato de email inválido');
    });
  });
}); 