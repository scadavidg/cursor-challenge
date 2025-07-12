Preview de Álbumes con Integración Deezer

## Descripción
Funcionalidad que permite escuchar previews de canciones de álbumes favoritos, usando Spotify como fuente principal y Deezer como alternativa.

## Características Principales

### ✅ Funcionalidades
- **Preview exclusivo para favoritos** - Solo disponible en álbumes guardados
- **Modal de detalles** - Información completa del álbum y lista de canciones
- **Reproductor global único** - Aparece debajo del botón "Ver en Spotify"
- **Control de volumen intuitivo** - Botón con popover y slider grande
- **Integración dual** - Spotify (principal) + Deezer (alternativa)
- **Reproducción automática** - Al seleccionar una canción

### �� Flujo de Usuario
1. Usuario va a favoritos → hace clic en álbum
2. Se abre modal con detalles y lista de canciones
3. Usuario hace clic en botón de audífonos de una canción
4. Reproductor global carga y reproduce automáticamente
5. Solo un preview se reproduce a la vez

## Arquitectura

### Componentes
- **AlbumPreviewModal** - Modal principal con reproductor global
- **EnhancedAudioPlayer** - Reproductor con control único
- **DeezerService** - Servicio para API de Deezer
- **useDeezerPreviews** - Hook para manejar previews

### APIs
- **GET /api/albums/[id]** - Detalles de álbum desde Spotify
- **POST /api/previews/deezer** - Búsqueda de previews en Deezer

### Flujo de Datos
1. Cargar álbum desde Spotify
2. Identificar canciones sin preview
3. Buscar alternativas en Deezer automáticamente
4. Prioridad: Spotify > Deezer > Sin preview

## Beneficios

1. **Mayor cobertura** - Más canciones con preview disponible
2. **Experiencia mejorada** - Reproducción controlada y controles claros
3. **Interfaz moderna** - Reproductor único y bien ubicado

## Configuración
- **Spotify**: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`
- **Deezer**: API pública (sin credenciales)

## Uso
1. Agregar álbumes a favoritos
2. Ir a página de favoritos
3. Hacer clic en álbum → seleccionar canción
4. Escuchar preview en reproductor global

## Limitaciones
- Preview limitado a 30 segundos
- No todas las canciones tienen preview
- Rate limiting en APIs públicas