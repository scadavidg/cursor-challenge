# Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database (PostgreSQL en Railway)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"

# SMTP Configuration (para recuperación de contraseña)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"

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

## Configuración de SMTP

### Gmail
1. **Habilitar 2FA** en tu cuenta de Google
2. **Generar App Password**:
   - Ve a Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Genera una contraseña para "Mail"
3. **Usar la App Password** en `SMTP_PASS`

### Otros Proveedores
- **Outlook**: `SMTP_HOST="smtp-mail.outlook.com"`
- **SendGrid**: `SMTP_HOST="smtp.sendgrid.net"` 