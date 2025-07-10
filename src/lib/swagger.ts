import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TuneStack API - Autenticación',
      version: '1.0.0',
      description: 'API para autenticación y gestión de usuarios de TuneStack',
      contact: {
        name: 'TuneStack Team',
        email: 'support@tunestack.com',
      },
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || 'http://localhost:9002',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del usuario',
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
            },
            image: {
              type: 'string',
              description: 'URL de la imagen de perfil',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              description: 'Nombre del usuario (mínimo 2 caracteres)',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña (mínimo 6 caracteres)',
            },
          },
        },
        SignupResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de confirmación',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
            },
          },
        },
        VerifyAuthResponse: {
          type: 'object',
          properties: {
            isAuthenticated: {
              type: 'boolean',
              description: 'Indica si el usuario está autenticado',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            message: {
              type: 'string',
              description: 'Mensaje informativo',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Detalles del error (opcional)',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/app/api/signup/route.ts',
    './src/app/api/verify-auth/route.ts',
    './src/app/api/auth/[...nextauth]/route.ts',
  ],
};

export const specs = swaggerJsdoc(options); 