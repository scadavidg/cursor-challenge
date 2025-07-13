import { GET } from '../route';

// Mock dependencies
jest.mock('@/lib/swagger', () => ({
  specs: {
    openapi: '3.0.0',
    info: {
      title: 'Music API',
      version: '1.0.0',
      description: 'API for music management'
    },
    paths: {
      '/api/albums/search': {
        get: {
          summary: 'Search albums'
        }
      }
    }
  }
}));

describe('GET /api/docs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('successful docs retrieval', () => {
    it('should return swagger specs', async () => {
      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.openapi).toBe('3.0.0');
      expect(data.info.title).toBe('Music API');
      expect(data.info.version).toBe('1.0.0');
      expect(data.paths).toHaveProperty('/api/albums/search');
    });

    it('should return JSON content type', async () => {
      // Act
      const response = await GET();

      // Assert
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should return valid JSON structure', async () => {
      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(typeof data).toBe('object');
      expect(data).toHaveProperty('openapi');
      expect(data).toHaveProperty('info');
      expect(data).toHaveProperty('paths');
    });
  });
}); 