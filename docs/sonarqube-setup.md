# SonarQube Configuration

Este proyecto está configurado para usar SonarQube para análisis de calidad de código.

## Configuración

### 1. Variables de Entorno

Las siguientes variables deben estar configuradas en GitHub Secrets:

- `SONAR_TOKEN`: Token de autenticación de SonarQube
- `SONAR_HOST_URL`: URL del servidor de SonarQube (ej: https://your-sonarqube.railway.app)

### 2. Archivos de Configuración

- `sonar-project.properties`: Configuración principal de SonarQube
- `.github/workflows/sonarqube.yml`: Workflow de GitHub Actions
- `jest.config.js`: Configuración de Jest para cobertura de código
- `jest.setup.js`: Setup de Jest para testing

## Uso

### Análisis Local

Para ejecutar SonarQube localmente:

```bash
# Instalar dependencias
npm install

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar análisis de SonarQube
npm run sonar:local
```

### Análisis en CI/CD

El análisis se ejecuta automáticamente en:
- Push a las ramas `main` y `develop`
- Pull requests a las ramas `main` y `develop`

### Scripts Disponibles

- `npm run sonar`: Ejecuta análisis de SonarQube usando las variables de entorno
- `npm run sonar:local`: Ejecuta análisis contra servidor local (localhost:9000)
- `npm run test:coverage`: Ejecuta tests con generación de reporte de cobertura

## Configuración del Proyecto en SonarQube

1. Crear un nuevo proyecto en SonarQube con la clave `cursor-challenge`
2. Generar un token de acceso para el proyecto
3. Configurar las variables de entorno en GitHub Secrets

## Exclusiones

Los siguientes archivos y directorios están excluidos del análisis:

- `node_modules/`
- `.next/`
- `coverage/`
- `public/`
- `prisma/migrations/`
- `docs/`
- Archivos de configuración (`.config.js`, `.config.ts`)
- Archivos de test (`.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx`)

## Quality Gates

El proyecto está configurado para esperar el resultado del Quality Gate de SonarQube. Esto significa que el análisis debe pasar todas las reglas configuradas para que el workflow sea exitoso.

## Troubleshooting

### Error de Token
Si recibes un error de autenticación, verifica que:
- El `SONAR_TOKEN` esté correctamente configurado en GitHub Secrets
- El token tenga permisos suficientes en el proyecto de SonarQube

### Error de URL
Si hay problemas con la URL del servidor:
- Verifica que `SONAR_HOST_URL` esté correctamente configurado
- Asegúrate de que el servidor de SonarQube esté accesible desde GitHub Actions

### Problemas de Cobertura
Si no se genera el reporte de cobertura:
- Verifica que los tests estén ejecutándose correctamente
- Asegúrate de que Jest esté configurado para generar reportes LCOV 