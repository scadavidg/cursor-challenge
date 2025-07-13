# Configuración de Google OAuth

Esta guía te ayudará a configurar la autenticación con Google en tu aplicación Next.js.

## Prerrequisitos

- Una cuenta de Google
- Acceso a Google Cloud Console
- Proyecto Next.js configurado con NextAuth.js

## Paso 1: Configurar Google Cloud Console

### 1.1 Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (si no está habilitada)

### 1.2 Configurar las credenciales OAuth 2.0

1. En el menú lateral, ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth 2.0 Client IDs**
3. Selecciona **Web application** como tipo de aplicación
4. Configura los siguientes campos:

#### URIs autorizados para JavaScript:
```
http://localhost:9002
http://localhost:3000
https://tu-dominio.com
```

#### URIs de redirección autorizados:
```
http://localhost:9002/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
https://tu-dominio.com/api/auth/callback/google
```

### 1.3 Obtener las credenciales

Después de crear las credenciales, obtendrás:
- **Client ID**: Un identificador único para tu aplicación
- **Client Secret**: Una clave secreta para autenticar las solicitudes

## Paso 2: Configurar las variables de entorno

Crea o actualiza tu archivo `.env.local` con las siguientes variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui

# NextAuth
NEXTAUTH_SECRET=tu_nextauth_secret_aqui
NEXTAUTH_URL=http://localhost:9002
```

### Generar NEXTAUTH_SECRET

Puedes generar un secret seguro usando:

```bash
openssl rand -base64 32
```

O usar un generador online de secrets.

## Paso 3: Verificar la configuración

### 3.1 Verificar que NextAuth esté configurado

El archivo `src/lib/auth.ts` ya debe tener el GoogleProvider habilitado:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),
```

### 3.2 Verificar la base de datos

El esquema de Prisma ya incluye las tablas necesarias para OAuth:
- `User` con campos para OAuth
- `Account` para almacenar tokens de OAuth
- `Session` para manejar sesiones

## Paso 4: Probar la autenticación

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:9002/login` o `http://localhost:9002/signup`

3. Haz clic en el botón "Continuar con Google"

4. Deberías ser redirigido a Google para autenticación

5. Después de autenticarte, serás redirigido de vuelta a tu aplicación

## Paso 5: Configuración para producción

### 5.1 Actualizar URIs en Google Cloud Console

Para producción, actualiza las URIs autorizadas:

#### URIs autorizados para JavaScript:
```
https://tu-dominio.com
```

#### URIs de redirección autorizados:
```
https://tu-dominio.com/api/auth/callback/google
```

### 5.2 Variables de entorno de producción

```env
NEXTAUTH_URL=https://tu-dominio.com
GOOGLE_CLIENT_ID=tu_client_id_produccion
GOOGLE_CLIENT_SECRET=tu_client_secret_produccion
NEXTAUTH_SECRET=tu_nextauth_secret_produccion
```

## Solución de problemas

### Error: "redirect_uri_mismatch"

Este error ocurre cuando la URI de redirección no coincide con las configuradas en Google Cloud Console.

**Solución:**
1. Verifica que las URIs de redirección en Google Cloud Console incluyan exactamente la URL de tu aplicación
2. Asegúrate de que `NEXTAUTH_URL` esté configurado correctamente

### Error: "invalid_client"

Este error indica que las credenciales de Google no son válidas.

**Solución:**
1. Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén correctamente configurados
2. Asegúrate de que las credenciales correspondan al proyecto correcto en Google Cloud Console

### Error: "access_denied"

El usuario canceló el proceso de autenticación.

**Solución:**
Este es un comportamiento normal cuando el usuario cancela. No requiere acción.

## Características implementadas

- ✅ Login con Google
- ✅ Registro con Google
- ✅ Integración con NextAuth.js
- ✅ Almacenamiento en base de datos con Prisma
- ✅ Manejo de sesiones
- ✅ UI responsive con separadores visuales
- ✅ Estados de carga
- ✅ Manejo de errores

## Archivos modificados

- `src/lib/auth.ts` - Habilitado GoogleProvider
- `src/components/auth/google-login-button.tsx` - Nuevo componente
- `src/components/auth/login-form.tsx` - Agregado botón de Google
- `src/components/auth/signup-form.tsx` - Agregado botón de Google

## Próximos pasos

1. Configurar las credenciales de Google en tu entorno
2. Probar la autenticación en desarrollo
3. Configurar para producción cuando esté listo
4. Considerar agregar otros proveedores OAuth (GitHub, Facebook, etc.) 