import { NextRequest } from 'next/server';
import { GET } from '../route';
import { getServerSession } from 'next-auth';
import { container } from '@/infrastructure/di/container';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/infrastructure/di/container');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockContainer = container as jest.Mocked<typeof container>;

describe('GET /api/favorites', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user favorites successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockFavorites = [
      { id: 'album1', title: 'Album 1', artist: 'Artist 1' },
      { id: 'album2', title: 'Album 2', artist: 'Artist 2' }
    ];

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockReturnValue({
      getFavorites: jest.fn().mockResolvedValue(mockFavorites)
    } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.favorites).toEqual(mockFavorites);
    expect(mockContainer.createFavoriteUseCases).toHaveBeenCalledWith('1');
  });

  it('should return 401 when user is not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/favorites');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("No autorizado");
  });

  it('should return 401 when session has no user', async () => {
    mockGetServerSession.mockResolvedValue({ user: null } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("No autorizado");
  });

  it('should return 401 when user has no id', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'test@example.com' } } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("No autorizado");
  });

  it('should return 500 when getFavorites throws an error', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockReturnValue({
      getFavorites: jest.fn().mockRejectedValue(new Error('Database error'))
    } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Error interno del servidor");
  });

  it('should return empty array when user has no favorites', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockReturnValue({
      getFavorites: jest.fn().mockResolvedValue([])
    } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.favorites).toEqual([]);
  });

  it('should handle unknown errors gracefully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockImplementation(() => {
      throw 'Unknown error';
    });

    const request = new NextRequest('http://localhost:3000/api/favorites');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Error interno del servidor");
  });
}); 