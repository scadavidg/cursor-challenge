import { NextRequest } from 'next/server';
import { GET } from '../route';
import { getServerSession } from 'next-auth';
import { container } from '@/infrastructure/di/container';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/infrastructure/di/container');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockContainer = container as jest.Mocked<typeof container>;

describe('GET /api/favorites/check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (url: string = 'http://localhost:3000/api/favorites/check'): NextRequest => {
    return {
      url
    } as NextRequest;
  };

  describe('successful favorite check', () => {
    it('should return true when album is in favorites', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        checkFavorite: jest.fn().mockResolvedValue(true)
      } as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(true);
      expect(mockContainer.createFavoriteUseCases).toHaveBeenCalledWith('1');
    });

    it('should return false when album is not in favorites', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        checkFavorite: jest.fn().mockResolvedValue(false)
      } as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-456');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
    });
  });

  describe('authentication handling', () => {
    it('should return false when user is not authenticated', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });

    it('should return false when session has no user', async () => {
      // Arrange
      const mockSession = {
        user: null
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });

    it('should return false when user has no id', async () => {
      // Arrange
      const mockSession = {
        user: {
          email: 'test@example.com'
          // No id
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
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

      const request = createMockRequest('http://localhost:3000/api/favorites/check');

      // Act
      const response = await GET(request);
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

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Datos inválidos');
      expect(mockContainer.createFavoriteUseCases).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should return false when checkFavorite throws error', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession as any);
      mockContainer.createFavoriteUseCases.mockReturnValue({
        checkFavorite: jest.fn().mockRejectedValue(new Error('Database error'))
      } as any);

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
    });

    it('should return false when getServerSession throws error', async () => {
      // Arrange
      mockGetServerSession.mockRejectedValue(new Error('Auth error'));

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
    });

    it('should return false when container throws error', async () => {
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

      const request = createMockRequest('http://localhost:3000/api/favorites/check?albumId=album-123');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
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
        checkFavorite: jest.fn().mockResolvedValue(true)
      } as any);

      const specialAlbumId = 'album-id-with-special-chars-!@#$%^&*()';
      const request = createMockRequest(`http://localhost:3000/api/favorites/check?albumId=${encodeURIComponent(specialAlbumId)}`);

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(true);
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
        checkFavorite: jest.fn().mockResolvedValue(false)
      } as any);

      const longAlbumId = 'a'.repeat(1000);
      const request = createMockRequest(`http://localhost:3000/api/favorites/check?albumId=${longAlbumId}`);

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.isFavorite).toBe(false);
    });
  });
}); 