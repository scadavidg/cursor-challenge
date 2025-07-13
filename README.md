# 🎸 RockStack - Plataforma de ExploraRock

Aplicación fullstack con Clean Architecture, integración con Spotify, Deezer y autenticación con credenciales y OAuth (Google). Diseñada para explorar álbumes de rock, marcarlos como favoritos y escuchar previews de canciones.

---

## 🚀 Características Principales

### 🔐 Autenticación y Registro

- Login con email/contraseña y soporte para Google OAuth (NextAuth.js)
- Validación de contraseñas con bcrypt + confirmación visual
- Protección de rutas privadas con JWT
- UI amigable y mensajes claros de feedback

### 🎧 Integración con Spotify y Deezer

- Búsqueda de álbumes del género *rock* exclusivamente
- Scroll infinito y eliminación de datos mock
- Previews de canciones con prioridad Spotify y fallback a Deezer
- Modal de detalles con tracks y reproductor global único

### ⭐ Sistema de Favoritos

- Agregar y eliminar favoritos con persistencia en PostgreSQL
- APIs RESTful para gestión de favoritos
- Hook personalizado `useFavorites` para sincronización frontend/backend
- Sección de favoritos con filtros, búsqueda y ordenamiento

### 📦 Sistema de Caché

- CacheManager con TTL para memoria y localStorage
- Invalidación automática y manual desde panel de debug
- Hooks especializados: `useAlbumCache`, `useDeezerPreviews`, `useCacheInvalidation`
- Reducción del 90% en llamadas redundantes al servidor

---

## 🧱 Arquitectura y Calidad de Código

### 🧼 Clean Architecture

- Separación clara por capas (Dominio, Infraestructura, Aplicación, Presentación)
- Repositorios e interfaces desacoplados (`IAlbumRepository`, `IFavoriteRepository`)
- Inyección de dependencias centralizada con contenedor DI
- Casos de uso testables y servicios desacoplados

### 🧪 Testing + SonarQube

- Integración con SonarQube para análisis de calidad
- Pruebas unitarias e integrales con Jest (`/api`, `/auth`, `/favorites`, `/deezer`)
- Scripts útiles:
  ```bash
  npm run test
  npm run test:coverage
  npm run sonar
  ```

---

## 🖼️ UI y Experiencia de Usuario

- UI responsive con Tailwind CSS
- Navbar dinámica, modales optimizados, página dedicada en móvil
- Skeletons, toasts, indicadores visuales y accesibilidad mejorada
- Indicador de caché 🖥️/💾 y reproductor global animado

---

## 🔧 Configuración y Despliegue

- Variables de entorno listas para Railway/Vercel:
  ```env
  DATABASE_URL=...
  NEXTAUTH_URL=...
  NEXTAUTH_SECRET=...
  SPOTIFY_CLIENT_ID=...
  SPOTIFY_CLIENT_SECRET=...
  SMTP_HOST=...
  SMTP_PORT=...
  SMTP_SECURE=...
  SMTP_PASS=...
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  ```
- Swagger para documentación de endpoints
- Soporte para `.env.local` en desarrollo y producción

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT.
