# Ejemplo de variables de entorno para Google OAuth

Crea un archivo `.env.local` en la raíz de tu proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"

# NextAuth
NEXTAUTH_SECRET="tu_nextauth_secret_aqui_generado_con_openssl_rand_-base64_32"
NEXTAUTH_URL="http://localhost:9002"

# Google OAuth
GOOGLE_CLIENT_ID="tu_client_id_de_google_cloud_console"
GOOGLE_CLIENT_SECRET="tu_client_secret_de_google_cloud_console"

# Email (opcional, para reset de contraseñas)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="tu_email@gmail.com"
EMAIL_SERVER_PASSWORD="tu_app_password_de_gmail"
EMAIL_FROM="tu_email@gmail.com"

# Otros servicios
DEEZER_API_URL="https://api.deezer.com"
SPOTIFY_CLIENT_ID="tu_spotify_client_id"
SPOTIFY_CLIENT_SECRET="tu_spotify_client_secret"
```

## Notas importantes:

1. **NUNCA** subas el archivo `.env.local` a Git
2. Asegúrate de que `.env.local` esté en tu `.gitignore`
3. Para producción, usa variables de entorno del servidor
4. El `NEXTAUTH_SECRET` debe ser único y seguro
5. Las credenciales de Google deben obtenerse de Google Cloud Console

## Generar NEXTAUTH_SECRET:

```bash
# En Windows PowerShell
openssl rand -base64 32

# O usar un generador online de secrets
```

## Configuración de Google Cloud Console:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Ve a "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configura las URIs autorizadas y de redirección
6. Copia el Client ID y Client Secret 