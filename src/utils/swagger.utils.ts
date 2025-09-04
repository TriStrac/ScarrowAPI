import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 5000;
const LOCAL = process.env.LOCAL || "192.168.0.137";
const API_URL = process.env.API_URL || `http://${LOCAL}:${PORT}`;
const isDocker = process.env.IS_DOCKER === 'true';
const apiFiles = isDocker ? ['./dist/routes/*.js'] : ['./src/routes/*.ts'];

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Scarrow API',
    version: '1.0.0',
    description: 'API documentation for Scarrow',
  },
  servers: [
    {
      url: API_URL,
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
  apis: apiFiles,
};

const swaggerSpecDoc = swaggerJSDoc(options);

export const swaggerSpec = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpecDoc),
};
