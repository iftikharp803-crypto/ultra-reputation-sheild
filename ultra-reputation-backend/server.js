// server.js - Ultra Reputation Shield Backend Server
// Optimized for Render Deployment

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Initialize Express app
const app = express();

// =============================================
// SECURITY MIDDLEWARE
// =============================================

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.CLIENT_URL],
    }
  }
}));

// Apply rate limiting to all requests
app.use(limiter);

// CORS configuration for production
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (if serving frontend)
app.use(express.static(path.join(__dirname, 'public')));

// =============================================
// ROUTE IMPORTS
// =============================================

// Import routes
const authRoutes = require('./src/routes/auth');
const businessRoutes = require('./src/routes/businesses');
const subscriptionRoutes = require('./src/routes/subscriptions');
const inquiryRoutes = require('./src/routes/inquiries');
const adminRoutes = require('./src/routes/admin');

// =============================================
// API ROUTES
// =============================================

// Health check endpoint (critical for Render)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Ultra Reputation Shield API is running perfectly!',
    service: 'Ultra Reputation Shield Backend API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Ultra Reputation Shield API',
    description: 'Premium Online Reputation Management Platform',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      subscriptions: '/api/subscriptions',
      businesses: '/api/businesses',
      inquiries: '/api/inquiries',
      admin: '/api/admin',
      health: '/api/health'
    },
    documentation: 'https://github.com/your-username/ultra-reputation-shield-backend'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// =============================================
// ERROR HANDLING MIDDLEWARE
// =============================================

// 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '🔍 Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/subscriptions/plans',
      'POST /api/inquiries'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global Error Handler:', error);

  // Database connection errors
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: 'Database connection failed',
      message: 'Cannot connect to the database. Please check if PostgreSQL is running.'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      message: 'Authentication token is invalid or expired'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: error.message
    });
  }

  // Rate limit errors
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many requests, please try again later.'
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong. Please try again later.' 
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// =============================================
// SERVER STARTUP (Optimized for Render)
// =============================================

const PORT = process.env.PORT || 5000;

// Graceful startup function
const startServer = async () => {
  try {
    // Test database connection
    const { pool } = require('./src/config/database');
    
    // Test database connection
    const client = await pool.connect();
    console.log('✅ Database connection test: SUCCESS');
    console.log('📊 Database:', process.env.DB_NAME || 'reputation_management');
    client.release();

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🎯 ==================================');
      console.log('🚀 ULTRA REPUTATION SHIELD SERVER');
      console.log('📡 Port:', PORT);
      console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
      console.log('🕒 Started at:', new Date().toLocaleString());
      console.log('🔒 Security: Helmet, CORS, Rate Limiting Active');
      console.log('🎯 ==================================');
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Check if PostgreSQL is running');
    console.log('   2. Verify database credentials in .env file');
    console.log('   3. Ensure database exists:', process.env.DB_NAME || 'reputation_management');
    console.log('   4. Check database host:', process.env.DB_HOST);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app; // For testing purposes