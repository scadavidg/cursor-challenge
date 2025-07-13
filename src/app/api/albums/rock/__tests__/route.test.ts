import { NextRequest } from 'next/server';
import { GET } from '../route';
import { container } from '@/infrastructure/di/container';
import { RockKeywordService } from '@/services/RockKeywordService';

// Mock dependencies
jest.mock('@/infrastructure/di/container');
jest.mock('@/services/RockKeywordService');

const mockContainer = container as jest.Mocked<typeof container>;
const mockRockKeywordService = RockKeywordService as jest.Mocked<typeof RockKeywordService>;

describe('GET /api/albums/rock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (url: string = 'http://localhost:3000/api/albums/rock'): NextRequest => {
    return {
      url
    } as NextRequest;
  };

  describe('successful rock albums retrieval', () => {
    it('should return rock albums with default pagination', async () => {
      // Arrange
      const mockKeywords = ['rock', 'metal', 'punk', 'grunge'];
      const mockAlbums = [
        { id: '1', title: 'Rock Album 1', artist: 'Rock Artist 1' },
        { id: '2', title: 'Metal Album 2', artist: 'Metal Artist 2' },
        { id: '3', title: 'Pop Album 3', artist: 'Pop Artist 3' } // Should be filtered out
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albums).toHaveLength(2); // Only rock and metal albums
      expect(data.page).toBe(1);
      expect(data.limit).toBe(12);
      expect(data.albums[0].title).toBe('Rock Album 1');
      expect(data.albums[1].title).toBe('Metal Album 2');
    });

    it('should handle custom pagination parameters', async () => {
      // Arrange
      const mockKeywords = ['rock', 'metal'];
      const mockAlbums = [
        { id: '1', title: 'Rock Album 1', artist: 'Rock Artist 1' },
        { id: '2', title: 'Metal Album 2', artist: 'Metal Artist 2' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest('http://localhost:3000/api/albums/rock?page=2&limit=5');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.page).toBe(2);
      expect(data.limit).toBe(5);
    });

    it('should handle case-insensitive keyword matching', async () => {
      // Arrange
      const mockKeywords = ['ROCK', 'Metal'];
      const mockAlbums = [
        { id: '1', title: 'Hard Rock Album', artist: 'Rock Band' },
        { id: '2', title: 'Pop Album', artist: 'Pop Artist' },
        { id: '3', title: 'Album', artist: 'Heavy Metal Band' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albums).toHaveLength(2); // Hard Rock and Heavy Metal
      expect(data.albums[0].title).toBe('Hard Rock Album');
      expect(data.albums[1].artist).toBe('Heavy Metal Band');
    });

    it('should handle albums with no rock keywords', async () => {
      // Arrange
      const mockKeywords = ['rock', 'metal'];
      const mockAlbums = [
        { id: '1', title: 'Pop Album 1', artist: 'Pop Artist 1' },
        { id: '2', title: 'Jazz Album 2', artist: 'Jazz Artist 2' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albums).toHaveLength(0);
    });
  });

  describe('pagination logic', () => {
    it('should fetch multiple pages to reach limit', async () => {
      // Arrange
      const mockKeywords = ['rock'];
      const mockAlbumsPage1 = [
        { id: '1', title: 'Pop Album 1', artist: 'Pop Artist 1' },
        { id: '2', title: 'Rock Album 2', artist: 'Rock Artist 2' }
      ];
      const mockAlbumsPage2 = [
        { id: '3', title: 'Rock Album 3', artist: 'Rock Artist 3' },
        { id: '4', title: 'Rock Album 4', artist: 'Rock Artist 4' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      const mockGetRockAlbums = jest.fn()
        .mockResolvedValueOnce(mockAlbumsPage1)
        .mockResolvedValueOnce(mockAlbumsPage2);

      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: mockGetRockAlbums
      } as any);

      const request = createMockRequest('http://localhost:3000/api/albums/rock?limit=3');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albums).toHaveLength(3);
      expect(mockGetRockAlbums).toHaveBeenCalledTimes(2);
      expect(mockGetRockAlbums).toHaveBeenCalledWith(1, 3);
      expect(mockGetRockAlbums).toHaveBeenCalledWith(2, 3);
    });

    it('should stop fetching when no more albums available', async () => {
      // Arrange
      const mockKeywords = ['rock'];
      const mockAlbumsPage1 = [
        { id: '1', title: 'Rock Album 1', artist: 'Rock Artist 1' }
      ];
      const mockAlbumsPage2: any[] = []; // No more albums

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      const mockGetRockAlbums = jest.fn()
        .mockResolvedValueOnce(mockAlbumsPage1)
        .mockResolvedValueOnce(mockAlbumsPage2);

      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: mockGetRockAlbums
      } as any);

      const request = createMockRequest('http://localhost:3000/api/albums/rock?limit=5');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albums).toHaveLength(1);
      expect(mockGetRockAlbums).toHaveBeenCalledTimes(2);
    });

    it('should respect max attempts limit', async () => {
      // Arrange
      const mockKeywords = ['rock'];
      const mockAlbums = [
        { id: '1', title: 'Pop Album 1', artist: 'Pop Artist 1' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest('http://localhost:3000/api/albums/rock?limit=10');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albums).toHaveLength(0); // No rock albums found
      // Should have called getRockAlbums multiple times but stopped at max attempts
    });
  });

  describe('error handling', () => {
    it('should handle RockKeywordService errors', async () => {
      // Arrange
      const errorMessage = 'Failed to load keywords';
      mockRockKeywordService.getAllKeywords.mockRejectedValue(new Error(errorMessage));

      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe(errorMessage);
    });

    it('should handle AlbumUseCases errors', async () => {
      // Arrange
      const mockKeywords = ['rock'];
      const errorMessage = 'Failed to fetch albums';

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockRejectedValue(new Error(errorMessage))
      } as any);

      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe(errorMessage);
    });

    it('should handle unknown errors', async () => {
      // Arrange
      mockRockKeywordService.getAllKeywords.mockRejectedValue('Unknown error');

      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });
  });

  describe('edge cases', () => {
    it('should handle invalid pagination parameters', async () => {
      // Arrange
      const mockKeywords = ['rock'];
      const mockAlbums = [
        { id: '1', title: 'Rock Album 1', artist: 'Rock Artist 1' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest('http://localhost:3000/api/albums/rock?page=invalid&limit=abc');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.page).toBe(1); // Default value
      expect(data.data.limit).toBe(12); // Default value
    });

    it('should handle very large limit values', async () => {
      // Arrange
      const mockKeywords = ['rock'];
      const mockAlbums = [
        { id: '1', title: 'Rock Album 1', artist: 'Rock Artist 1' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest('http://localhost:3000/api/albums/rock?limit=1000');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.limit).toBe(1000);
    });

    it('should handle empty keywords list', async () => {
      // Arrange
      const mockKeywords: string[] = [];
      const mockAlbums = [
        { id: '1', title: 'Rock Album 1', artist: 'Rock Artist 1' }
      ];

      mockRockKeywordService.getAllKeywords.mockResolvedValue(mockKeywords);
      mockContainer.getAlbumUseCases.mockReturnValue({
        getRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.albums).toHaveLength(0); // No keywords to match
    });
  });
}); 