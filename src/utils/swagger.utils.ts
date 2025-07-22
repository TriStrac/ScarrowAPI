import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 5000;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Scarrow API',
    version: '1.0.0',
    description: 'API documentation for Scarrow',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
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
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

const swaggerSpecDoc = swaggerJSDoc(options);

export const swaggerSpec = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpecDoc),
};
