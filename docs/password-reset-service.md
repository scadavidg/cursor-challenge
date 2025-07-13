# Servicio de Recuperación de Contraseña - RockStack

## Resumen

Este servicio proporciona una funcionalidad completa de recuperación de contraseña usando SMTP para enviar emails con tokens seguros. Implementa las mejores prácticas de seguridad y sigue la arquitectura limpia del proyecto.

## Características

- ✅ **Tokens seguros**: Generación de tokens únicos con crypto
- ✅ **Expiración automática**: Tokens expiran en 1 hora
- ✅ **Emails HTML**: Plantillas profesionales con branding de RockStack
- ✅ **Validación robusta**: Validación de contraseñas con requisitos de seguridad
- ✅ **Seguridad**: No revela si un email existe o no
- ✅ **Limpieza automática**: Eliminación de tokens expirados
- ✅ **Logging**: Registro completo de operaciones
- ✅ **Confirmación**: Email de confirmación al cambiar contraseña

## Configuración

### Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"

# NextAuth (ya configurado)
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="tu-secret-key"
```

### Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. **Habilitar 2FA** en tu cuenta de Google
2. **Generar App Password**:
   - Ve a Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Genera una contraseña para "Mail"
3. **Usar la App Password** en `SMTP_PASS`

### Otros Proveedores SMTP

#### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

#### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
```

## Arquitectura

### 1. Servicios

#### EmailService
- **Responsabilidad**: Envío de emails usando nodemailer
- **Métodos**:
  - `sendPasswordResetEmail()`: Envía email con enlace de recuperación
  - `sendPasswordChangedEmail()`: Envía confirmación de cambio

#### PasswordResetService
- **Responsabilidad**: Lógica de negocio para reset de contraseña
- **Métodos**:
  - `generateResetToken()`: Genera y envía token
  - `verifyResetToken()`: Verifica validez del token
  - `resetPassword()`: Cambia la contraseña
  - `cleanupExpiredTokens()`: Limpia tokens expirados

### 2. Casos de Uso

#### PasswordResetUseCases
- **Responsabilidad**: Orquestación de operaciones
- **Métodos**:
  - `requestPasswordReset()`: Solicita reset
  - `resetPassword()`: Ejecuta reset
  - `verifyResetToken()`: Verifica token

### 3. Validadores

#### passwordResetValidator
- **requestPasswordResetSchema**: Valida email
- **resetPasswordSchema**: Valida nueva contraseña con requisitos de seguridad

### 4. Endpoints API

#### POST `/api/auth/forgot-password`
- **Descripción**: Solicita reset de contraseña
- **Body**: `{ email: string }`
- **Respuesta**: Mensaje de confirmación

#### POST `/api/auth/reset-password`
- **Descripción**: Cambia la contraseña
- **Body**: `{ email, token, password, confirmPassword }`
- **Respuesta**: Confirmación de cambio

#### GET `/api/auth/verify-reset-token`
- **Descripción**: Verifica validez del token
- **Query**: `email` y `token`
- **Respuesta**: `{ valid: boolean }`

### 5. Páginas Frontend

#### `/forgot-password`
- Formulario para solicitar reset
- Validación en tiempo real
- Estados de carga y confirmación

#### `/reset-password`
- Formulario para nueva contraseña
- Verificación automática del token
- Validación de requisitos de seguridad

## Flujo de Usuario

### 1. Solicitud de Reset
```
Usuario → /forgot-password → Ingresa email → POST /api/auth/forgot-password
```

### 2. Procesamiento
```
Servidor → Genera token → Guarda en DB → Envía email → Usuario recibe email
```

### 3. Reset de Contraseña
```
Usuario → Click en email → /reset-password → Verifica token → Cambia contraseña
```

### 4. Confirmación
```
Servidor → Actualiza contraseña → Envía confirmación → Usuario puede hacer login
```

## Seguridad

### Tokens
- **Generación**: 32 bytes aleatorios (64 caracteres hex)
- **Almacenamiento**: Hasheados con bcrypt
- **Expiración**: 1 hora automática
- **Uso único**: Se eliminan después de usar

### Contraseñas
- **Longitud mínima**: 8 caracteres
- **Complejidad**: Mayúsculas, minúsculas y números
- **Hasheo**: bcrypt con 12 rounds

### Privacidad
- **No revela emails**: Respuesta idéntica si email existe o no
- **Rate limiting**: Implementar en producción
- **Logs seguros**: No registra información sensible

## Emails

### Plantilla de Reset
- **Asunto**: "Recuperación de Contraseña - RockStack"
- **Contenido**: Enlace con token, instrucciones, expiración
- **Diseño**: HTML responsive con branding

### Plantilla de Confirmación
- **Asunto**: "Contraseña Cambiada - RockStack"
- **Contenido**: Confirmación de cambio, enlace al login
- **Diseño**: HTML con indicadores visuales de éxito

## Mantenimiento

### Limpieza de Tokens
```typescript
// Ejecutar periódicamente (cron job)
const passwordResetService = new PasswordResetService();
await passwordResetService.cleanupExpiredTokens();
```

### Monitoreo
- **Logs**: Todas las operaciones se registran
- **Métricas**: Tasa de éxito, errores de email
- **Alertas**: Fallos en envío de emails

## Testing

### Pruebas Unitarias
```bash
npm test -- --testPathPattern=password-reset
```

### Pruebas de Integración
- Verificar envío de emails
- Probar flujo completo
- Validar expiración de tokens

## Troubleshooting

### Error de SMTP
```
Error: Invalid login
```
**Solución**: Verificar credenciales y App Password

### Token no válido
```
Error: Token inválido o expirado
```
**Solución**: Verificar expiración y formato del token

### Email no recibido
**Verificar**:
- Carpeta de spam
- Configuración SMTP
- Logs del servidor

## Próximas Mejoras

- [ ] Rate limiting por IP
- [ ] Notificaciones push
- [ ] Integración con servicios de email (SendGrid, Mailgun)
- [ ] Plantillas personalizables
- [ ] Métricas y analytics
- [ ] Soporte para múltiples idiomas

## Conclusión

El servicio de recuperación de contraseña está completamente implementado y listo para producción. Proporciona una experiencia de usuario segura y profesional, siguiendo las mejores prácticas de seguridad y la arquitectura limpia del proyecto. 