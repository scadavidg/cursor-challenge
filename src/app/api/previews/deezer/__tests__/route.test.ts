import { NextRequest } from 'next/server';
import { POST } from '../route';
import { DeezerService } from '@/services/DeezerService';

// Mock dependencies
jest.mock('@/services/DeezerService');

const mockDeezerService = DeezerService as jest.MockedClass<typeof DeezerService>;

describe('POST /api/previews/deezer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body)
    } as any;
  };

  describe('successful preview retrieval', () => {
    it('should return previews for all songs', async () => {
      // Arrange
      const songNames = ['Song 1', 'Song 2', 'Song 3'];
      const mockPreviews = ['preview1.mp3', 'preview2.mp3', 'preview3.mp3'];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn()
          .mockResolvedValueOnce(mockPreviews[0])
          .mockResolvedValueOnce(mockPreviews[1])
          .mockResolvedValueOnce(mockPreviews[2])
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual(mockPreviews);
      expect(mockDeezerService).toHaveBeenCalled();
    });

    it('should handle songs with no previews', async () => {
      // Arrange
      const songNames = ['Song 1', 'Song 2', 'Song 3'];
      const mockPreviews = ['preview1.mp3', null, 'preview3.mp3'];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn()
          .mockResolvedValueOnce(mockPreviews[0])
          .mockResolvedValueOnce(mockPreviews[1])
          .mockResolvedValueOnce(mockPreviews[2])
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual(mockPreviews);
      expect(data.previews[1]).toBeNull();
    });

    it('should handle empty song list', async () => {
      // Arrange
      const songNames: string[] = [];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn()
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual([]);
      expect(mockDeezerService).toHaveBeenCalled();
    });
  });

  describe('input validation', () => {
    it('should return 400 when songNames is missing', async () => {
      // Arrange
      const request = createMockRequest({});

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Lista de nombres de canciones requerida');
      expect(mockDeezerService).not.toHaveBeenCalled();
    });

    it('should return 400 when songNames is null', async () => {
      // Arrange
      const request = createMockRequest({ songNames: null });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Lista de nombres de canciones requerida');
      expect(mockDeezerService).not.toHaveBeenCalled();
    });

    it('should return 400 when songNames is not an array', async () => {
      // Arrange
      const request = createMockRequest({ songNames: 'not an array' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Lista de nombres de canciones requerida');
      expect(mockDeezerService).not.toHaveBeenCalled();
    });

    it('should return 400 when songNames is an object', async () => {
      // Arrange
      const request = createMockRequest({ songNames: { song: 'test' } });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Lista de nombres de canciones requerida');
      expect(mockDeezerService).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle individual song preview errors gracefully', async () => {
      // Arrange
      const songNames = ['Song 1', 'Song 2', 'Song 3'];
      const mockPreviews = ['preview1.mp3', null, 'preview3.mp3'];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn()
          .mockResolvedValueOnce(mockPreviews[0])
          .mockRejectedValueOnce(new Error('Deezer API error'))
          .mockResolvedValueOnce(mockPreviews[2])
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual(mockPreviews);
      expect(data.previews[1]).toBeNull();
    });

    it('should handle all songs failing', async () => {
      // Arrange
      const songNames = ['Song 1', 'Song 2'];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn()
          .mockRejectedValue(new Error('Deezer API error'))
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual([null, null]);
    });

    it('should handle request.json() errors', async () => {
      // Arrange
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as any;

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Invalid JSON');
    });

    it('should handle unknown errors', async () => {
      // Arrange
      const request = {
        json: jest.fn().mockRejectedValue('Unknown error')
      } as any;

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });
  });

  describe('edge cases', () => {
    it('should handle songs with special characters', async () => {
      // Arrange
      const songNames = ['Song with special chars: !@#$%^&*()', 'Normal Song'];
      const mockPreviews = ['preview1.mp3', 'preview2.mp3'];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn()
          .mockResolvedValueOnce(mockPreviews[0])
          .mockResolvedValueOnce(mockPreviews[1])
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual(mockPreviews);
    });

    it('should handle very long song names', async () => {
      // Arrange
      const longSongName = 'a'.repeat(1000);
      const songNames = [longSongName];
      const mockPreviews = ['preview1.mp3'];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn().mockResolvedValue(mockPreviews[0])
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual(mockPreviews);
    });

    it('should handle empty song names', async () => {
      // Arrange
      const songNames = ['', 'Valid Song', ''];
      const mockPreviews = [null, 'preview2.mp3', null];

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn()
          .mockResolvedValueOnce(mockPreviews[0])
          .mockResolvedValueOnce(mockPreviews[1])
          .mockResolvedValueOnce(mockPreviews[2])
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toEqual(mockPreviews);
    });

    it('should handle large number of songs', async () => {
      // Arrange
      const songNames = Array.from({ length: 100 }, (_, i) => `Song ${i + 1}`);
      const mockPreviews = songNames.map((_, i) => `preview${i + 1}.mp3`);

      mockDeezerService.mockImplementation(() => ({
        getTrackPreview: jest.fn().mockImplementation((songName) => {
          const index = songNames.indexOf(songName);
          return Promise.resolve(mockPreviews[index]);
        })
      } as any));

      const request = createMockRequest({ songNames });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.previews).toHaveLength(100);
      expect(data.previews[0]).toBe('preview1.mp3');
      expect(data.previews[99]).toBe('preview100.mp3');
    });
  });
}); 