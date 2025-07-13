import { NextRequest } from 'next/server';
import { GET } from '../route';
import { SpotifyService } from '@/services/SpotifyService';

// Mock dependencies
jest.mock('@/services/SpotifyService');

const mockSpotifyService = SpotifyService as jest.MockedClass<typeof SpotifyService>;

describe('GET /api/albums/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (): NextRequest => {
    return {} as NextRequest;
  };

  const createMockParams = (id: string) => {
    return Promise.resolve({ id });
  };

  describe('successful album retrieval', () => {
    it('should return album details with tracks when valid ID is provided', async () => {
      // Arrange
      const albumId = 'valid-album-id';
      const mockAlbumDetails = {
        id: albumId,
        name: 'Test Album',
        artist: 'Test Artist',
        image: 'album-cover.jpg',
        releaseDate: '2023-01-01'
      };
      const mockAlbumTracks = [
        { id: 'track1', name: 'Track 1', duration: 180 },
        { id: 'track2', name: 'Track 2', duration: 200 }
      ];

      mockSpotifyService.mockImplementation(() => ({
        getAlbumDetails: jest.fn().mockResolvedValue(mockAlbumDetails),
        getAlbumTracks: jest.fn().mockResolvedValue(mockAlbumTracks)
      } as any));

      const request = createMockRequest();
      const params = createMockParams(albumId);

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockAlbumDetails,
        tracks: mockAlbumTracks
      });
      expect(mockSpotifyService).toHaveBeenCalled();
    });

    it('should handle album with no tracks', async () => {
      // Arrange
      const albumId = 'album-no-tracks';
      const mockAlbumDetails = {
        id: albumId,
        name: 'Album Without Tracks',
        artist: 'Test Artist',
        image: 'album-cover.jpg',
        releaseDate: '2023-01-01'
      };
      const mockAlbumTracks: any[] = [];

      mockSpotifyService.mockImplementation(() => ({
        getAlbumDetails: jest.fn().mockResolvedValue(mockAlbumDetails),
        getAlbumTracks: jest.fn().mockResolvedValue(mockAlbumTracks)
      } as any));

      const request = createMockRequest();
      const params = createMockParams(albumId);

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.tracks).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should return 400 when album ID is missing', async () => {
      // Arrange
      const request = createMockRequest();
      const params = Promise.resolve({ id: '' });

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('ID de álbum requerido');
      expect(mockSpotifyService).not.toHaveBeenCalled();
    });

    it('should return 400 when album ID is undefined', async () => {
      // Arrange
      const request = createMockRequest();
      const params = Promise.resolve({ id: undefined as any });

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('ID de álbum requerido');
      expect(mockSpotifyService).not.toHaveBeenCalled();
    });

    it('should handle Spotify service errors', async () => {
      // Arrange
      const albumId = 'invalid-album-id';
      const errorMessage = 'Album not found';

      mockSpotifyService.mockImplementation(() => ({
        getAlbumDetails: jest.fn().mockRejectedValue(new Error(errorMessage)),
        getAlbumTracks: jest.fn().mockResolvedValue([])
      } as any));

      const request = createMockRequest();
      const params = createMockParams(albumId);

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe(errorMessage);
    });

    it('should handle unknown errors', async () => {
      // Arrange
      const albumId = 'error-album-id';

      mockSpotifyService.mockImplementation(() => ({
        getAlbumDetails: jest.fn().mockRejectedValue('Unknown error'),
        getAlbumTracks: jest.fn().mockResolvedValue([])
      } as any));

      const request = createMockRequest();
      const params = createMockParams(albumId);

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });

    it('should handle partial service failures', async () => {
      // Arrange
      const albumId = 'partial-failure-album';
      const mockAlbumDetails = {
        id: albumId,
        name: 'Test Album',
        artist: 'Test Artist'
      };

      mockSpotifyService.mockImplementation(() => ({
        getAlbumDetails: jest.fn().mockResolvedValue(mockAlbumDetails),
        getAlbumTracks: jest.fn().mockRejectedValue(new Error('Tracks service error'))
      } as any));

      const request = createMockRequest();
      const params = createMockParams(albumId);

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Tracks service error');
    });
  });

  describe('edge cases', () => {
    it('should handle very long album IDs', async () => {
      // Arrange
      const longAlbumId = 'a'.repeat(1000);
      const mockAlbumDetails = {
        id: longAlbumId,
        name: 'Long ID Album',
        artist: 'Test Artist'
      };
      const mockAlbumTracks: any[] = [];

      mockSpotifyService.mockImplementation(() => ({
        getAlbumDetails: jest.fn().mockResolvedValue(mockAlbumDetails),
        getAlbumTracks: jest.fn().mockResolvedValue(mockAlbumTracks)
      } as any));

      const request = createMockRequest();
      const params = createMockParams(longAlbumId);

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.id).toBe(longAlbumId);
    });

    it('should handle special characters in album ID', async () => {
      // Arrange
      const specialAlbumId = 'album-id-with-special-chars-!@#$%^&*()';
      const mockAlbumDetails = {
        id: specialAlbumId,
        name: 'Special Chars Album',
        artist: 'Test Artist'
      };
      const mockAlbumTracks: any[] = [];

      mockSpotifyService.mockImplementation(() => ({
        getAlbumDetails: jest.fn().mockResolvedValue(mockAlbumDetails),
        getAlbumTracks: jest.fn().mockResolvedValue(mockAlbumTracks)
      } as any));

      const request = createMockRequest();
      const params = createMockParams(specialAlbumId);

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.id).toBe(specialAlbumId);
    });
  });
}); 