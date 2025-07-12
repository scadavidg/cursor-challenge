import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";
import { IFavoriteRepository } from "@/domain/repositories/IFavoriteRepository";
import { IExternalMusicService } from "@/domain/services/IExternalMusicService";
import { SpotifyAlbumRepository } from "@/infrastructure/repositories/SpotifyAlbumRepository";
import { FavoriteRepository } from "@/infrastructure/repositories/FavoriteRepository";
import { SpotifyService } from "@/services/SpotifyService";
import { DeezerService } from "@/services/DeezerService";
import { AlbumUseCases } from "@/domain/usecases/AlbumUseCases";
import { FavoriteUseCases } from "@/domain/usecases/FavoriteUseCases";

class DependencyContainer {
  private static instance: DependencyContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  private initializeServices() {
    // External Services
    this.services.set('SpotifyService', new SpotifyService());
    this.services.set('DeezerService', new DeezerService());

    // Repositories
    this.services.set('SpotifyAlbumRepository', new SpotifyAlbumRepository(
      this.get<IExternalMusicService>('SpotifyService')
    ));

    // Use Cases
    this.services.set('AlbumUseCases', new AlbumUseCases(
      this.get<IAlbumRepository>('SpotifyAlbumRepository')
    ));
  }

  // Método para crear repositorio de favoritos con contexto de usuario
  createFavoriteRepository(userId: string): FavoriteRepository {
    return new FavoriteRepository(userId);
  }

  // Método para crear casos de uso de favoritos con contexto de usuario
  createFavoriteUseCases(userId: string): FavoriteUseCases {
    const favoriteRepository = this.createFavoriteRepository(userId);
    return new FavoriteUseCases(favoriteRepository);
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return service as T;
  }

  // Métodos de conveniencia para obtener servicios específicos
  getAlbumUseCases(): AlbumUseCases {
    return this.get<AlbumUseCases>('AlbumUseCases');
  }

  getSpotifyService(): SpotifyService {
    return this.get<SpotifyService>('SpotifyService');
  }

  getDeezerService(): DeezerService {
    return this.get<DeezerService>('DeezerService');
  }
}

export const container = DependencyContainer.getInstance(); 