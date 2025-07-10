# Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database (PostgreSQL en Railway)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"

# Para producción, genera una clave secreta segura:
# openssl rand -base64 32
```

## Configuración en Railway

1. Ve a tu proyecto en Railway
2. Crea una nueva base de datos PostgreSQL
3. Copia la URL de conexión
4. Reemplaza `DATABASE_URL` con la URL de Railway

## Generar NEXTAUTH_SECRET

Para producción, ejecuta este comando para generar una clave segura:

```bash
openssl rand -base64 32
```

## Variables para OAuth (Futuro)

Cuando agregues autenticación con Google, necesitarás estas variables adicionales:

```env
# Google OAuth (para el futuro)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
``` 