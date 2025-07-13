import { NextRequest } from 'next/server';
import { GET } from '../route';
import { container } from '@/infrastructure/di/container';
import { RockKeywordService } from '@/services/RockKeywordService';

// Mock dependencies
jest.mock('@/infrastructure/di/container');
jest.mock('@/services/RockKeywordService');

const mockContainer = container as jest.Mocked<typeof container>;
const mockRockKeywordService = RockKeywordService as jest.Mocked<typeof RockKeywordService>;

describe('GET /api/albums/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (query: string, page?: string, limit?: string): NextRequest => {
    const url = new URL('http://localhost:3000/api/albums/search');
    if (query) url.searchParams.set('query', query);
    if (page) url.searchParams.set('page', page);
    if (limit) url.searchParams.set('limit', limit);
    
    return {
      url: url.toString(),
    } as NextRequest;
  };

  describe('successful rock search', () => {
    it('should return albums when searching for rock music', async () => {
      // Arrange
      const mockAlbums = [
        { id: 1, title: 'Back in Black', artist: 'AC/DC' },
        { id: 2, title: 'Led Zeppelin IV', artist: 'Led Zeppelin' }
      ];
      
      mockRockKeywordService.isRockKeyword.mockResolvedValue(true);
      mockContainer.getAlbumUseCases.mockReturnValue({
        searchRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest('AC/DC');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.albums).toEqual(mockAlbums);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(12);
      expect(mockRockKeywordService.isRockKeyword).toHaveBeenCalledWith('AC/DC');
    });

    it('should use custom page and limit parameters', async () => {
      // Arrange
      const mockAlbums = [{ id: 1, title: 'Test Album', artist: 'Test Artist' }];
      
      mockRockKeywordService.isRockKeyword.mockResolvedValue(true);
      mockContainer.getAlbumUseCases.mockReturnValue({
        searchRockAlbums: jest.fn().mockResolvedValue(mockAlbums)
      } as any);

      const request = createMockRequest('Queen', '2', '5');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.page).toBe(2);
      expect(data.data.limit).toBe(5);
      expect(mockContainer.getAlbumUseCases().searchRockAlbums).toHaveBeenCalledWith('Queen', 2, 5);
    });
  });

  describe('non-rock search handling', () => {
    it('should return fun message when searching for non-rock music', async () => {
      // Arrange
      mockRockKeywordService.isRockKeyword.mockResolvedValue(false);
      
      const request = createMockRequest('Justin Bieber');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.albums).toEqual([]);
      expect(data.data.funMessage).toBeDefined();
      expect(typeof data.funMessage).toBe('string');
      expect(data.funMessage.length).toBeGreaterThan(0);
      expect(mockRockKeywordService.isRockKeyword).toHaveBeenCalledWith('Justin Bieber');
    });

    it('should return fun message for empty query', async () => {
      // Arrange
      const request = createMockRequest('');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.albums).toEqual([]);
      expect(data.data.funMessage).toBeDefined();
      expect(mockRockKeywordService.isRockKeyword).toHaveBeenCalledWith('');
    });

    it('should return fun message for whitespace-only query', async () => {
      // Arrange
      const request = createMockRequest('   ');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.albums).toEqual([]);
      expect(data.data.funMessage).toBeDefined();
      expect(mockRockKeywordService.isRockKeyword).toHaveBeenCalledWith('   ');
    });
  });

  describe('error handling', () => {
    it('should handle RockKeywordService errors', async () => {
      // Arrange
      mockRockKeywordService.isRockKeyword.mockRejectedValue(new Error('Database error'));
      
      const request = createMockRequest('AC/DC');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });

    it('should handle AlbumUseCases errors', async () => {
      // Arrange
      mockRockKeywordService.isRockKeyword.mockResolvedValue(true);
      mockContainer.getAlbumUseCases.mockReturnValue({
        searchRockAlbums: jest.fn().mockRejectedValue(new Error('Search failed'))
      } as any);

      const request = createMockRequest('AC/DC');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Search failed');
    });

    it('should handle unknown errors', async () => {
      // Arrange
      mockRockKeywordService.isRockKeyword.mockRejectedValue('Unknown error');
      
      const request = createMockRequest('AC/DC');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });
  });

  describe('parameter parsing', () => {
    it('should handle invalid page parameter', async () => {
      // Arrange
      mockRockKeywordService.isRockKeyword.mockResolvedValue(true);
      mockContainer.getAlbumUseCases.mockReturnValue({
        searchRockAlbums: jest.fn().mockResolvedValue([])
      } as any);

      const request = createMockRequest('AC/DC', 'invalid');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.page).toBeNull(); // API returns null for invalid parameters
    });

    it('should handle invalid limit parameter', async () => {
      // Arrange
      mockRockKeywordService.isRockKeyword.mockResolvedValue(true);
      mockContainer.getAlbumUseCases.mockReturnValue({
        searchRockAlbums: jest.fn().mockResolvedValue([])
      } as any);

      const request = createMockRequest('AC/DC', '1', 'invalid');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.limit).toBeNull(); // API returns null for invalid parameters
    });
  });
}); 