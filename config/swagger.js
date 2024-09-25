const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the application',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', // Local URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Booking: {
          type: 'object',
          required: ['items', 'price', 'is_in_school', 'pickup_date', 'delivery_date', 'storage_duration', 'can_call'],
          properties: {
            booking_id: { type: 'integer', description: 'Unique booking ID' },
            items: {
              type: 'array',
              items: { type: 'string', description: 'Array of item ObjectIds' },
            },
            price: { type: 'number', description: 'Total price of the booking' },
            is_in_school: { type: 'boolean', description: 'Whether the booking is for a school' },
            school_name: { type: 'string', description: 'Name of the school (if applicable)' },
            name_of_hall: { type: 'string', description: 'Name of the hall (if applicable)' },
            pickup_date: { type: 'string', format: 'date', description: 'Pickup date' },
            delivery_date: { type: 'string', format: 'date', description: 'Delivery date' },
            storage_duration: { type: 'integer', description: 'Storage duration in days' },
            can_call: { type: 'boolean', description: 'Whether they can call' },
          },
        },
        User: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'phone_number', 'password', 'country', 'city'],
          properties: {
            user_id: { type: 'string', description: 'Unique user ID' },
            first_name: { type: 'string', description: 'User first name' },
            last_name: { type: 'string', description: 'User last name' },
            email: { type: 'string', format: 'email', description: 'User email address' },
            phone_number: { type: 'string', description: 'User phone number' },
            password: { type: 'string', description: 'User password' },
            country: { type: 'string', description: 'Country of residence' },
            city: { type: 'string', description: 'City of residence' },
            vacvault_id: { type: 'string', description: 'Optional VacVault ID' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      authAction: {
        BearerAuth: {
          name: "BearerAuth",
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: ""
          },
          value: "Bearer <JWT>"
        }
      }
    }
  }));
};

module.exports = setupSwagger;
