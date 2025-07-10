# Sistema de Autenticación - RockStack

## 🚀 Configuración Completa

Este proyecto incluye un sistema de autenticación completo con NextAuth, Prisma y PostgreSQL, preparado para escalar con OAuth.

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL (Railway)
- Cuenta en Railway

## 🔧 Instalación y Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Database (PostgreSQL en Railway)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="oWOyCD3sAxcSk0XhPgn7KVg1Asr0h/HcakdBWt4s74s="
```

### 2. Configurar Base de Datos en Railway

1. Ve a [Railway](https://railway.app/)
2. Crea un nuevo proyecto
3. Agrega una base de datos PostgreSQL
4. Copia la URL de conexión
5. Reemplaza `DATABASE_URL` en tu `.env.local`

### 3. Ejecutar Migraciones

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init
```

### 4. Iniciar el Servidor

```bash
npm run dev
```

## 🔐 Endpoints de Autenticación

### Registro de Usuario
- **URL:** `POST /api/signup`
- **Body:**
```json
{
  "name": "Nombre Usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Inicio de Sesión
- **URL:** `POST /api/auth/signin`
- **Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Verificar Autenticación
- **URL:** `GET /api/verify-auth`
- **Headers:** Requiere token de sesión

### Cerrar Sesión
- **URL:** `POST /api/auth/signout`

## 📚 Documentación de la API

Visita `/api-docs` para ver la documentación interactiva de Swagger con todos los endpoints.

## 🛡️ Características de Seguridad

- ✅ Hasheo de contraseñas con bcrypt (12 rounds)
- ✅ Validación de datos con Zod
- ✅ JWT tokens seguros
- ✅ Middleware de protección de rutas
- ✅ Preparado para OAuth (Google, GitHub, etc.)

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # NextAuth endpoints
│   │   ├── signup/route.ts                # Registro de usuarios
│   │   ├── verify-auth/route.ts           # Verificación de auth
│   │   └── docs/route.ts                  # Documentación Swagger
│   ├── api-docs/page.tsx                  # Página de documentación
│   └── layout.tsx                         # Layout con SessionProvider
├── components/
│   └── auth/
│       ├── login-form.tsx                 # Formulario de login
│       └── signup-form.tsx                # Formulario de registro
├── contexts/
│   └── auth-context.tsx                   # Contexto de autenticación
├── lib/
│   ├── auth.ts                            # Configuración NextAuth
│   ├── prisma.ts                          # Cliente de Prisma
│   ├── swagger.ts                         # Configuración Swagger
│   └── types.ts                           # Tipos de NextAuth
├── middleware.ts                          # Protección de rutas
└── prisma/
    └── schema.prisma                      # Esquema de base de datos
```

## 🎯 Uso en el Frontend

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
if (!isAuthenticated) {
  return <div>Acceso denegado</div>;
}
```

## 🔄 Próximos Pasos para OAuth

Para agregar autenticación con Google:

1. **Configurar Google OAuth:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto y habilita Google+ API
   - Configura las credenciales OAuth

2. **Agregar Variables de Entorno:**
```env
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
```

3. **Actualizar auth.ts:**
```typescript
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({...}),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // ... resto de la configuración
};
```

## 🐛 Troubleshooting

### Error de Conexión a la Base de Datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos esté accesible

### Error de NEXTAUTH_SECRET
- Usa la clave generada: `oWOyCD3sAxcSk0XhPgn7KVg1Asr0h/HcakdBWt4s74s=`
- Para producción, genera una nueva con: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### Error de Migración
```bash
npx prisma migrate reset
npx prisma generate
npx prisma migrate dev --name init
```

## 📝 Notas Importantes

- Las contraseñas se hashean automáticamente antes de guardarse
- El middleware protege automáticamente las rutas `/home`, `/favorites`, `/explore`
- Los usuarios autenticados son redirigidos automáticamente desde `/login` y `/signup`
- El modelo de usuario está preparado para OAuth con campos `provider` y `providerAccountId`

## 🎉 ¡Listo!

Tu sistema de autenticación está completamente configurado y listo para usar. Los usuarios pueden registrarse, iniciar sesión y acceder a las rutas protegidas de manera segura. 