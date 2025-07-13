import { NextRequest } from 'next/server';
import { GET } from '../route';
import { AuthService } from '@/services/AuthService';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';

// Mock dependencies
jest.mock('@/services/AuthService');
jest.mock('@/infrastructure/repositories/UserRepository');

const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;
const mockUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;

describe('GET /api/verify-auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (authHeader?: string): NextRequest => {
    const headers = new Map();
    if (authHeader) {
      headers.set('authorization', authHeader);
    }
    
    return {
      headers: {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'authorization') {
            return authHeader;
          }
          return null;
        })
      }
    } as any;
  };

  describe('successful authentication verification', () => {
    it('should return user data when token is valid', async () => {
      // Arrange
      const mockPayload = {
        id: 'user-123',
        email: 'test@example.com'
      };

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: 'profile.jpg',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };

      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(mockPayload)
      } as any));

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest('Bearer valid-token-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.isAuthenticated).toBe(true);
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        image: mockUser.image,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      });
      expect(mockAuthService).toHaveBeenCalled();
      expect(mockUserRepository).toHaveBeenCalled();
    });

    it('should handle user without image', async () => {
      // Arrange
      const mockPayload = {
        id: 'user-123',
        email: 'test@example.com'
      };

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };

      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(mockPayload)
      } as any));

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest('Bearer valid-token-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.isAuthenticated).toBe(true);
      expect(data.user.image).toBeNull();
    });
  });

  describe('authentication header handling', () => {
    it('should return 401 when no authorization header is present', async () => {
      // Arrange
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.isAuthenticated).toBe(false);
      expect(data.message).toBe('No autenticado');
      expect(mockAuthService).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Bearer', async () => {
      // Arrange
      const request = createMockRequest('Invalid-Token-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.isAuthenticated).toBe(false);
      expect(data.message).toBe('No autenticado');
      expect(mockAuthService).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is empty', async () => {
      // Arrange
      const request = createMockRequest('Bearer ');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.isAuthenticated).toBe(false);
      expect(data.message).toBe('No autenticado');
      expect(mockAuthService).not.toHaveBeenCalled();
    });
  });

  describe('token validation', () => {
    it('should return 401 when token is invalid', async () => {
      // Arrange
      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(null)
      } as any));

      const request = createMockRequest('Bearer invalid-token');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.isAuthenticated).toBe(false);
      expect(data.message).toBe('Token inválido');
      expect(mockUserRepository).not.toHaveBeenCalled();
    });

    it('should return 401 when token payload is missing id', async () => {
      // Arrange
      const mockPayload = {
        email: 'test@example.com'
        // Missing id
      };

      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(mockPayload)
      } as any));

      const request = createMockRequest('Bearer token-without-id');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.isAuthenticated).toBe(false);
      expect(data.message).toBe('Token inválido');
      expect(mockUserRepository).not.toHaveBeenCalled();
    });

    it('should return 401 when token verification throws error', async () => {
      // Arrange
      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockRejectedValue(new Error('Token expired'))
      } as any));

      const request = createMockRequest('Bearer expired-token');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.isAuthenticated).toBe(false);
      expect(data.error).toBe('Token expired');
    });
  });

  describe('user lookup', () => {
    it('should return 404 when user is not found', async () => {
      // Arrange
      const mockPayload = {
        id: 'user-123',
        email: 'nonexistent@example.com'
      };

      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(mockPayload)
      } as any));

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(null)
      } as any));

      const request = createMockRequest('Bearer valid-token');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.isAuthenticated).toBe(false);
      expect(data.message).toBe('Usuario no encontrado');
    });

    it('should handle database errors during user lookup', async () => {
      // Arrange
      const mockPayload = {
        id: 'user-123',
        email: 'test@example.com'
      };

      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(mockPayload)
      } as any));

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      } as any));

      const request = createMockRequest('Bearer valid-token');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.isAuthenticated).toBe(false);
      expect(data.error).toBe('Database connection failed');
    });
  });

  describe('error handling', () => {
    it('should handle unknown errors', async () => {
      // Arrange
      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockRejectedValue('Unknown error')
      } as any));

      const request = createMockRequest('Bearer valid-token');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.isAuthenticated).toBe(false);
      expect(data.error).toBe('Error interno del servidor');
    });

    it('should handle malformed token', async () => {
      // Arrange
      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockRejectedValue(new Error('Malformed token'))
      } as any));

      const request = createMockRequest('Bearer malformed-token');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.isAuthenticated).toBe(false);
      expect(data.error).toBe('Malformed token');
    });
  });

  describe('edge cases', () => {
    it('should handle very long token', async () => {
      // Arrange
      const longToken = 'Bearer ' + 'A'.repeat(10000);
      const mockPayload = {
        id: 'user-123',
        email: 'test@example.com'
      };

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };

      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(mockPayload)
      } as any));

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest(longToken);

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.isAuthenticated).toBe(true);
    });

    it('should handle special characters in email', async () => {
      // Arrange
      const mockPayload = {
        id: 'user-123',
        email: 'test+tag@example.com'
      };

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test+tag@example.com',
        image: null,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };

      mockAuthService.mockImplementation(() => ({
        verifyToken: jest.fn().mockResolvedValue(mockPayload)
      } as any));

      mockUserRepository.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(mockUser)
      } as any));

      const request = createMockRequest('Bearer valid-token');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.user.email).toBe('test+tag@example.com');
    });
  });
}); 