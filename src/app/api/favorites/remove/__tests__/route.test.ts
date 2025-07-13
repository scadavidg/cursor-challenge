import { NextRequest } from 'next/server';
import { DELETE } from '../route';
import { getServerSession } from 'next-auth';
import { container } from '@/infrastructure/di/container';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/infrastructure/di/container');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockContainer = container as jest.Mocked<typeof container>;

describe('DELETE /api/favorites/remove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (url: string = 'http://localhost:3000/api/favorites/remove'): NextRequest => {
    return {
      url
    } as NextRequest;
  };

  describe('successful favorite removal', () => {
    it('should remove album from favorites successfully', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        removeFavorite: jest.fn().mockResolvedValue(undefined)
      } as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.message).toBe('Álbum eliminado de favoritos');
      expect(data.data.albumId).toBe('album-123');
      expect(mockContainer.createFavoriteUseCases).toHaveBeenCalledWith('1');
    });
  });

  describe('authentication handling', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe('No autorizado');
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });

    it('should return 401 when session has no user', async () => {
      // Arrange
      const mockSession = {
        user: null
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe('No autorizado');
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });

    it('should return 401 when user has no id', async () => {
      // Arrange
      const mockSession = {
        user: {
          email: 'test@example.com'
          // No id
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe('No autorizado');
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });
  });

  describe('input validation', () => {
    it('should return 400 when albumId is missing', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Datos inválidos');
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });

    it('should return 400 when albumId is empty', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Datos inválidos');
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should return 404 when album was not in favorites', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        removeFavorite: jest.fn().mockRejectedValue(new Error('El álbum no estaba en tus favoritos'))
      } as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-456');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('El álbum no estaba en tus favoritos');
    });

    it('should return 500 when removeFavorite throws generic error', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        removeFavorite: jest.fn().mockRejectedValue(new Error('Database connection error'))
      } as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Database connection error');
    });

    it('should return 500 when removeFavorite throws unknown error', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        removeFavorite: jest.fn().mockRejectedValue('Unknown error')
      } as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });

    it('should return 500 when getServerSession throws error', async () => {
      // Arrange
      mockGetServerSession.mockRejectedValue(new Error('Auth error'));

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Auth error');
    });

    it('should return 500 when container throws error', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockImplementation(() => {
        throw new Error('Container error');
      });

      const request = createMockRequest('http://localhost:3000/api/favorites/remove?albumId=album-123');

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Container error');
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in albumId', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        removeFavorite: jest.fn().mockResolvedValue(undefined)
      } as any);

      const specialAlbumId = 'album-id-with-special-chars-!@#$%^&*()';
      const request = createMockRequest(`http://localhost:3000/api/favorites/remove?albumId=${encodeURIComponent(specialAlbumId)}`);

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albumId).toBe(specialAlbumId);
    });

    it('should handle very long albumId', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        removeFavorite: jest.fn().mockResolvedValue(undefined)
      } as any);

      const longAlbumId = 'a'.repeat(1000);
      const request = createMockRequest(`http://localhost:3000/api/favorites/remove?albumId=${longAlbumId}`);

      // Act
      const response = await DELETE(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albumId).toBe(longAlbumId);
    });
  });
}); 