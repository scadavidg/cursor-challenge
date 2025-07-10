# Configuración del Sistema de Autenticación

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/RockStack"

# NextAuth
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Generar NEXTAUTH_SECRET

Para producción, genera una clave secreta segura:

```bash
openssl rand -base64 32
```

## Configuración de la Base de Datos

1. **Configurar PostgreSQL en Railway:**
   - Crea una nueva base de datos PostgreSQL en Railway
   - Copia la URL de conexión y agrégala a `DATABASE_URL`

2. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generar el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

## Endpoints Disponibles

### 1. Registro de Usuario
- **URL:** `POST /api/signup`
- **Descripción:** Registra un nuevo usuario con email y contraseña
- **Body:**
  ```json
  {
    "name": "Nombre Usuario",
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```

### 2. Inicio de Sesión
- **URL:** `POST /api/auth/signin`
- **Descripción:** Inicia sesión con credenciales (manejado por NextAuth)
- **Body:**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```

### 3. Verificación de Autenticación
- **URL:** `GET /api/verify-auth`
- **Descripción:** Verifica si el usuario está autenticado
- **Headers:** Requiere token de sesión

### 4. Cerrar Sesión
- **URL:** `POST /api/auth/signout`
- **Descripción:** Cierra la sesión del usuario

## Documentación de la API

La documentación completa de la API está disponible en:
- **URL:** `/api-docs`
- **Descripción:** Interfaz interactiva de Swagger con todos los endpoints

## Características de Seguridad

1. **Hasheo de Contraseñas:** Las contraseñas se hashean con bcrypt (12 rounds)
2. **Validación de Datos:** Uso de Zod para validación de esquemas
3. **JWT Tokens:** NextAuth maneja automáticamente los tokens JWT
4. **Preparado para OAuth:** El modelo de usuario incluye campos para futura integración con Google OAuth

## Estructura del Modelo de Usuario

```prisma
model User {
  id                String    @id @default(cuid())
  name              String?
  email             String    @unique
  emailVerified     DateTime?
  image             String?
  password          String?   // Para autenticación con credenciales
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Campos para OAuth (preparados para el futuro)
  provider          String?   // "google", "github", etc.
  providerAccountId String?   // ID del usuario en el proveedor OAuth
  
  // Relaciones
  accounts          Account[]
  sessions          Session[]
  favorites         Favorite[]
}
```

## Uso en el Frontend

### Hook de Autenticación

```typescript
import { useAuth } from "@/contexts/auth-context";

const { isAuthenticated, login, logout, isLoading, user } = useAuth();
```

### Ejemplo de Login

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    // Redirección automática a /home
  } catch (error) {
    console.error("Error de login:", error);
  }
};
```

### Protección de Rutas

```typescript
// En componentes que requieren autenticación
if (!isAuthenticated) {
  return <div>Acceso denegado</div>;
}
```

## Próximos Pasos para OAuth

Para agregar autenticación con Google:

1. Configurar Google OAuth en Google Cloud Console
2. Agregar el proveedor Google a `authOptions` en `src/lib/auth.ts`
3. Configurar las variables de entorno para Google OAuth
4. Los campos `provider` y `providerAccountId` ya están preparados en el modelo

## Troubleshooting

### Error de Conexión a la Base de Datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos esté accesible desde tu entorno

### Error de NEXTAUTH_SECRET
- Genera una nueva clave secreta
- Asegúrate de que sea consistente entre reinicios del servidor

### Error de Migración
- Ejecuta `npx prisma migrate reset` para resetear la base de datos
- Verifica que el esquema de Prisma sea válido 