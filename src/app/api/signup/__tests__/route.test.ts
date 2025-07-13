import { NextRequest } from 'next/server';
import { POST } from '../route';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { HashService } from '@/services/HashService';
import { UserUseCases } from '@/domain/usecases/UserUseCases';
import { ZodError } from 'zod';

// Mock dependencies
jest.mock('@/infrastructure/repositories/UserRepository');
jest.mock('@/services/HashService');
jest.mock('@/domain/usecases/UserUseCases');

const mockUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;
const mockHashService = HashService as jest.MockedClass<typeof HashService>;
const mockUserUseCases = UserUseCases as jest.MockedClass<typeof UserUseCases>;

describe('POST /api/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body),
    } as any;
  };

  describe('successful user registration', () => {
    it('should register user successfully with valid data', async () => {
      // Arrange
      const signupData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(mockUser)
      } as any));

      mockHashService.mockImplementation(() => ({
        hash: jest.fn().mockResolvedValue('hashedPassword')
      } as any));

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.message).toBe('Usuario registrado exitosamente');
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      });
      expect(mockUserUseCases).toHaveBeenCalledWith(
        expect.objectContaining({
          findByEmail: expect.any(Function),
          create: expect.any(Function)
        }),
        expect.objectContaining({
          hash: expect.any(Function)
        })
      );
    });

    it('should handle user with minimal required fields', async () => {
      // Arrange
      const signupData = {
        name: 'Minimal User',
        email: 'minimal@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-456',
        name: 'Minimal User',
        email: 'minimal@example.com'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      });
    });
  });

  describe('validation error handling', () => {
    it('should handle Zod validation errors', async () => {
      // Arrange
      const signupData = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: wrong email format
        password: '123' // Invalid: too short password
      };

      const zodError = new ZodError([
        {
          code: 'invalid_string',
          message: 'Invalid email',
          path: ['email'],
          validation: 'email'
        } as any,
        {
          code: 'too_small',
          message: 'Password too short',
          path: ['password'],
          minimum: 8,
          inclusive: true,
          type: 'string'
        } as any
      ]);

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockRejectedValue(zodError)
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Datos inválidos');
      expect(data.details).toBeDefined();
      expect(Array.isArray(data.details)).toBe(true);
    });

    it('should handle missing required fields', async () => {
      // Arrange
      const signupData = {
        name: 'Test User'
        // Missing email and password
      };

      const zodError = new ZodError([
        {
          code: 'invalid_type',
          message: 'Required',
          path: ['email'],
          expected: 'string',
          received: 'undefined'
        } as any,
        {
          code: 'invalid_type',
          message: 'Required',
          path: ['password'],
          expected: 'string',
          received: 'undefined'
        } as any
      ]);

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockRejectedValue(zodError)
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Datos inválidos');
    });
  });

  describe('business logic error handling', () => {
    it('should handle email already exists error', async () => {
      // Arrange
      const signupData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockRejectedValue(new Error('El email ya está registrado'))
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('El email ya está registrado');
    });

    it('should handle weak password error', async () => {
      // Arrange
      const signupData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockRejectedValue(new Error('La contraseña debe tener al menos 8 caracteres'))
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('La contraseña debe tener al menos 8 caracteres');
    });

    it('should handle database connection errors', async () => {
      // Arrange
      const signupData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockRejectedValue(new Error('Error de conexión a la base de datos'))
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Error de conexión a la base de datos');
    });
  });

  describe('request handling', () => {
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

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockRejectedValue(new Error('Datos de entrada requeridos'))
      } as any));

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Datos de entrada requeridos');
    });

    it('should handle unknown errors', async () => {
      // Arrange
      const signupData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockRejectedValue('Unknown error')
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Error interno del servidor');
    });
  });

  describe('edge cases', () => {
    it('should handle very long user name', async () => {
      // Arrange
      const signupData = {
        name: 'A'.repeat(1000),
        email: 'longname@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-789',
        name: 'A'.repeat(1000),
        email: 'longname@example.com'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.user.name).toBe('A'.repeat(1000));
    });

    it('should handle special characters in email', async () => {
      // Arrange
      const signupData = {
        name: 'Test User',
        email: 'test+tag@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'user-101',
        name: 'Test User',
        email: 'test+tag@example.com'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.user.email).toBe('test+tag@example.com');
    });

    it('should handle complex password with special characters', async () => {
      // Arrange
      const signupData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'P@ssw0rd!123'
      };

      const mockUser = {
        id: 'user-202',
        name: 'Test User',
        email: 'test@example.com'
      };

      mockUserUseCases.mockImplementation(() => ({
        registerUser: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest(signupData);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      });
    });
  });
}); 