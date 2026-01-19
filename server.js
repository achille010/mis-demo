require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const debug = require('debug')('app:server');
const config = require('config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
const env = process.env.NODE_ENV || (config.has('server.env') ? config.get('server.env') : 'development');
if (env === 'development') {
  app.use(morgan('dev'));
  debug('Morgan enabled');
}

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || (config.has('server.port') ? config.get('server.port') : 3000);
const server = app.listen(PORT, () => {
  debug(`Server running on port ${PORT}`);
  debug(`Environment: ${env}`);
  debug(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = server;

