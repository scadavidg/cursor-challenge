import { NextRequest } from 'next/server';
import { POST } from '../route';
import { getServerSession } from 'next-auth';
import { container } from '@/infrastructure/di/container';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/infrastructure/di/container');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockContainer = container as jest.Mocked<typeof container>;

describe('POST /api/favorites/add', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add favorite successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockAlbum = {
      id: 'album1',
      title: 'Test Album',
      artist: 'Test Artist',
      cover: 'test-cover.jpg'
    };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockReturnValue({
      addFavorite: jest.fn().mockResolvedValue(undefined)
    } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: mockAlbum })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.message).toBe("Álbum agregado a favoritos");
    expect(mockContainer.createFavoriteUseCases).toHaveBeenCalledWith('1');
  });

  it('should return 401 when user is not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: { id: 'album1' } })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("No autorizado");
  });

  it('should return 401 when session has no user', async () => {
    mockGetServerSession.mockResolvedValue({ user: null } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: { id: 'album1' } })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("No autorizado");
  });

  it('should return 401 when user has no id', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'test@example.com' } } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: { id: 'album1' } })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("No autorizado");
  });

  it('should return 400 when album is missing', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Datos inválidos");
  });

  it('should return 400 when album has no id', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: { title: 'Test Album' } })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Datos inválidos");
  });

  it('should return 400 when request body is invalid JSON', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: 'invalid json'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Datos inválidos");
  });

  it('should return 500 when addFavorite throws an error', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockAlbum = { id: 'album1', title: 'Test Album' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockReturnValue({
      addFavorite: jest.fn().mockRejectedValue(new Error('Database error'))
    } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: mockAlbum })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Error interno del servidor");
  });

  it('should handle unknown errors gracefully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockAlbum = { id: 'album1', title: 'Test Album' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockImplementation(() => {
      throw 'Unknown error';
    });

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: mockAlbum })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Error interno del servidor");
  });

  it('should handle album with minimal required fields', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockAlbum = { id: 'album1' };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockReturnValue({
      addFavorite: jest.fn().mockResolvedValue(undefined)
    } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: mockAlbum })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.message).toBe("Álbum agregado a favoritos");
  });

  it('should handle album with all fields', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockAlbum = {
      id: 'album1',
      title: 'Test Album',
      artist: 'Test Artist',
      cover: 'test-cover.jpg',
      releaseDate: '2023-01-01',
      genre: 'Rock',
      tracks: 12,
      duration: 3600
    };

    mockGetServerSession.mockResolvedValue({ user: mockUser } as any);
    mockContainer.createFavoriteUseCases.mockReturnValue({
      addFavorite: jest.fn().mockResolvedValue(undefined)
    } as any);

    const request = new NextRequest('http://localhost:3000/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ album: mockAlbum })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.message).toBe("Álbum agregado a favoritos");
  });
}); 