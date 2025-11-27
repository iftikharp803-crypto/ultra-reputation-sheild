/**
 * ULTRA-REPUTATION-SHIELD SERVER - 10000% ERROR-PROOF
 * MAXIMUM ACCURACY & ZERO DOWNTIME ARCHITECTURE
 */

// ========== ULTRA-SAFE DEPENDENCY LOADING ==========
const dependencyManager = (() => {
    const coreDependencies = [
        'express', 'pg', 'dotenv', 'helmet', 'cors', 
        'express-rate-limit', 'compression', 'bcryptjs',
        'jsonwebtoken', 'nodemailer'
    ];

    const loadedDeps = {};
    const criticalErrors = [];

    coreDependencies.forEach(dep => {
        try {
            loadedDeps[dep] = require(dep);
            console.log(`✅ ${dep} loaded successfully`);
        } catch (error) {
            criticalErrors.push({ dependency: dep, error: error.message });
            console.error(`❌ CRITICAL: ${dep} failed - ${error.message}`);
        }
    });

    if (criticalErrors.length > 0) {
        console.error('🚨 MISSING DEPENDENCIES:', criticalErrors);
        console.error('💡 RUN: npm install', coreDependencies.join(' '));
        process.exit(1);
    }

    return loadedDeps;
})();

const {
    express, 
    pg, 
    dotenv, 
    helmet, 
    cors, 
    expressRateLimit,
    compression,
    bcryptjs,
    jsonwebtoken,
    nodemailer
} = dependencyManager;

// ========== BULLETPROOF ENVIRONMENT CONFIG ==========
class UltraConfig {
    constructor() {
        this.loadEnvironment();
        this.validateConfig();
    }

    loadEnvironment() {
        try {
            dotenv.config();
            console.log('✅ Environment loaded successfully');
        } catch (error) {
            console.warn('⚠️ Environment load warning, using secure defaults');
        }
    }

    validateConfig() {
        const required = [
            'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
            'JWT_SECRET', 'PORT', 'CLIENT_URL'
        ];

        const missing = required.filter(key => !process.env[key]);
        if (missing.length > 0) {
            console.error(`🚨 MISSING ENV VARS: ${missing.join(', ')}`);
            process.exit(1);
        }

        console.log('✅ All environment variables validated');
    }

    get database() {
        return {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            database: process.env.DB_NAME || 'reputation_management',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '9865743210',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
            maxRetries: 10,
            retryDelay: 2000
        };
    }

    get security() {
        return {
            jwtSecret: process.env.JWT_SECRET,
            jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
            rateLimitWindow: 15 * 60 * 1000,
            rateLimitMax: 1000,
            corsOrigin: process.env.CLIENT_URL || 'http://localhost:3000'
        };
    }

    get server() {
        return {
            port: parseInt(process.env.PORT) || 5000,
            nodeEnv: process.env.NODE_ENV || 'development'
        };
    }
}

const config = new UltraConfig();

// ========== MILITARY-GRADE LOGGING SYSTEM ==========
class MilitaryLogger {
    constructor() {
        this.levels = ['INFO', 'WARN', 'ERROR', 'CRITICAL'];
    }

    format(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logId = `LOG_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
        
        const logEntry = {
            id: logId,
            timestamp,
            level,
            message,
            ...meta
        };

        const consoleMessage = `[${level}] ${timestamp}: ${message}`;
        
        // Color coding for different levels
        switch(level) {
            case 'INFO':
                console.log(`🟢 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
                break;
            case 'WARN':
                console.warn(`🟡 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
                break;
            case 'ERROR':
                console.error(`🔴 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
                break;
            case 'CRITICAL':
                console.error(`💥 ${consoleMessage}`, Object.keys(meta).length ? meta : '');
                break;
        }

        return logEntry;
    }

    info(message, meta = {}) {
        return this.format('INFO', message, meta);
    }

    warn(message, meta = {}) {
        return this.format('WARN', message, meta);
    }

    error(message, error = null, meta = {}) {
        const errorMeta = error ? {
            errorMessage: error.message,
            errorStack: error.stack,
            errorCode: error.code
        } : {};
        
        return this.format('ERROR', message, { ...errorMeta, ...meta });
    }

    critical(message, error = null, meta = {}) {
        const criticalMeta = error ? {
            errorMessage: error.message,
            errorStack: error.stack,
            emergency: 'CRITICAL_FAILURE'
        } : {};
        
        const log = this.format('CRITICAL', message, { ...criticalMeta, ...meta });
        
        // In production, this would trigger alerts
        if (config.server.nodeEnv === 'production') {
            this.triggerAlert(log);
        }
        
        return log;
    }

    triggerAlert(logEntry) {
        // Integration with monitoring services would go here
        console.error('🚨 ALERT TRIGGERED:', logEntry);
    }
}

const logger = new MilitaryLogger();

// ========== INDESTRUCTIBLE DATABASE CONNECTION ==========
class IndestructibleDatabase {
    constructor(config) {
        this.config = config;
        this.pool = null;
        this.isConnected = false;
        this.connectionAttempts = 0;
        this.maxRetries = config.maxRetries || 10;
    }

    async connectWithMilitaryPrecision() {
        logger.info('🛡️ Initializing military-grade database connection');
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                logger.info(`Database connection attempt ${attempt}/${this.maxRetries}`, {
                    host: this.config.host,
                    database: this.config.database
                });

                this.pool = new pg.Pool(this.config);
                
                // Triple-verification connection test
                const client = await this.pool.connect();
                await this.verifyConnection(client);
                client.release();

                this.isConnected = true;
                this.connectionAttempts = 0;
                
                logger.info('✅ Database connection established with military precision', {
                    host: this.config.host,
                    database: this.config.database,
                    port: this.config.port
                });

                this.setupConnectionMonitoring();
                return true;

            } catch (error) {
                this.isConnected = false;
                this.connectionAttempts++;
                
                const errorLevel = attempt >= this.maxRetries - 2 ? 'ERROR' : 'WARN';
                logger[errorLevel.toLowerCase()](`Database connection failed (attempt ${attempt}/${this.maxRetries})`, error, {
                    attempt,
                    maxRetries: this.maxRetries
                });

                if (attempt === this.maxRetries) {
                    logger.critical('💥 All database connection attempts failed - SYSTEM HALTED', error);
                    return false;
                }

                // Exponential backoff with jitter
                const baseDelay = this.config.retryDelay * Math.pow(2, attempt - 1);
                const jitter = baseDelay * 0.1 * Math.random();
                const delay = Math.min(baseDelay + jitter, 30000); // Max 30 seconds
                
                logger.warn(`Retrying in ${Math.round(delay)}ms...`);
                await this.ultraSafeSleep(delay);
            }
        }
    }

    async verifyConnection(client) {
        // Triple verification
        await client.query('SELECT 1 as connectivity_test');
        await client.query('SELECT NOW() as time_sync_check');
        const version = await client.query('SELECT version() as db_version');
        
        logger.info('✅ Database connection triple-verified', {
            version: version.rows[0].db_version
        });
    }

    setupConnectionMonitoring() {
        this.pool.on('error', (err) => {
            logger.error('Database pool error', err);
            this.isConnected = false;
            this.initiateHealingProcedure();
        });

        this.pool.on('connect', () => {
            logger.info('✅ New database connection established');
            this.isConnected = true;
        });

        // Health check every 30 seconds
        setInterval(() => this.healthCheck(), 30000);
    }

    async initiateHealingProcedure() {
        logger.warn('🚑 Initiating database connection healing procedure');
        await this.connectWithMilitaryPrecision();
    }

    async ultraSafeSleep(ms) {
        return new Promise(resolve => {
            const timeoutId = setTimeout(resolve, ms);
            // Ensure timeout doesn't hang
            timeoutId.unref && timeoutId.unref();
        });
    }

    async query(text, params = [], options = {}) {
        if (!this.isConnected) {
            throw new Error('Database not connected - initiating emergency procedures');
        }

        const startTime = Date.now();
        const queryId = `QUERY_${startTime}_${Math.random().toString(36).substr(2, 6)}`;

        try {
            logger.info('Executing database query', {
                queryId,
                query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                paramCount: params.length
            });

            const result = await this.pool.query(text, params);
            const duration = Date.now() - startTime;

            logger.info('Query executed successfully', {
                queryId,
                duration: `${duration}ms`,
                rowCount: result.rowCount,
                performance: duration > 1000 ? 'SLOW' : 'OPTIMAL'
            });

            return result;

        } catch (error) {
            const duration = Date.now() - startTime;
            logger.error('Query execution failed', error, {
                queryId,
                query: text,
                params: params.map(p => typeof p === 'string' ? p.substring(0, 50) : p),
                duration: `${duration}ms`
            });

            // Automatic retry for connection issues
            if (error.code && error.code.startsWith('08') || error.code === '57P01') {
                logger.warn('Connection-related error detected - attempting auto-recovery');
                this.isConnected = false;
                await this.initiateHealingProcedure();
            }

            throw error;
        }
    }

    async healthCheck() {
        try {
            const startTime = Date.now();
            await this.query('SELECT 1 as health_check');
            const duration = Date.now() - startTime;

            return {
                status: 'HEALTHY',
                timestamp: new Date().toISOString(),
                responseTime: duration,
                connections: this.pool.totalCount,
                idle: this.pool.idleCount,
                waiting: this.pool.waitingCount
            };
        } catch (error) {
            return {
                status: 'UNHEALTHY',
                timestamp: new Date().toISOString(),
                error: error.message,
                emergency: 'DATABASE_CONNECTION_LOST'
            };
        }
    }
}

// ========== ULTRA-SECURE APPLICATION SETUP ==========
const app = express();
const db = new IndestructibleDatabase(config.database);

// ========== MILITARY-GRADE MIDDLEWARE ==========

// 1. Security Headers (Fort Knox Level)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", config.security.corsOrigin],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// 2. CORS with Military Precision
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            config.security.corsOrigin,
            'http://localhost:3000',
            'https://localhost:3000'
        ];

        // Allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            logger.warn('CORS violation attempt blocked', { origin });
            callback(new Error('Not allowed by CORS - ULTRA REPUTATION SHIELD ACTIVE'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 3. Rate Limiting (DDoS Protection)
const ultraLimiter = expressRateLimit({
    windowMs: config.security.rateLimitWindow,
    max: config.security.rateLimitMax,
    message: {
        success: false,
        error: 'Rate limit exceeded - please slow down',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1' // Allow localhost
});
app.use(ultraLimiter);

// 4. Body Parsing with Maximum Security
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            throw new Error('Invalid JSON payload - potential attack blocked');
        }
    }
}));

app.use(express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 100
}));

// 5. Compression for performance
app.use(compression({ level: 6 }));

// ========== BULLETPROOF AUTHENTICATION SYSTEM ==========
class UltraAuth {
    constructor() {
        this.jwtSecret = config.security.jwtSecret;
        this.jwtExpiresIn = config.security.jwtExpiresIn;
    }

    generateToken(payload) {
        try {
            return jsonwebtoken.sign(
                { 
                    ...payload, 
                    timestamp: Date.now(),
                    security: 'ULTRA_REPUTATION_SHIELD'
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiresIn }
            );
        } catch (error) {
            logger.error('Token generation failed', error);
            throw new Error('Authentication system error');
        }
    }

    verifyToken(token) {
        try {
            return jsonwebtoken.verify(token, this.jwtSecret);
        } catch (error) {
            logger.warn('Token verification failed', error);
            throw new Error('Invalid or expired token');
        }
    }

    async hashPassword(password) {
        try {
            return await bcryptjs.hash(password, 12);
        } catch (error) {
            logger.error('Password hashing failed', error);
            throw new Error('Password processing error');
        }
    }

    async verifyPassword(password, hash) {
        try {
            return await bcryptjs.compare(password, hash);
        } catch (error) {
            logger.error('Password verification failed', error);
            throw new Error('Password verification error');
        }
    }
}

const auth = new UltraAuth();

// ========== MILITARY-GRADE VALIDATION SYSTEM ==========
class MilitaryValidation {
    static validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password && password.length >= 8;
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.trim().replace(/[<>]/g, '');
    }

    static validateBusinessData(data) {
        const errors = [];
        
        if (!data.name || data.name.length < 2) errors.push('Business name too short');
        if (!data.description || data.description.length < 10) errors.push('Description too short');
        if (data.rating && (data.rating < 1 || data.rating > 5)) errors.push('Invalid rating');
        
        return errors;
    }
}

// ========== ULTRA-ROBUST API ENDPOINTS ==========

// 1. System Health Check (Comprehensive)
app.get('/health', async (req, res) => {
    try {
        const startTime = Date.now();
        
        const [dbHealth, memoryUsage, systemInfo] = await Promise.all([
            db.healthCheck(),
            Promise.resolve(process.memoryUsage()),
            Promise.resolve({
                nodeVersion: process.version,
                platform: process.platform,
                uptime: process.uptime(),
                cpuUsage: process.cpuUsage()
            })
        ]);

        const responseTime = Date.now() - startTime;

        const healthStatus = {
            status: dbHealth.status === 'HEALTHY' ? 'OPERATIONAL' : 'DEGRADED',
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
            system: {
                uptime: `${Math.floor(systemInfo.uptime)}s`,
                memory: {
                    used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
                },
                node: systemInfo.nodeVersion
            },
            database: dbHealth,
            security: 'ULTRA_REPUTATION_SHIELD_ACTIVE'
        };

        const statusCode = healthStatus.status === 'OPERATIONAL' ? 200 : 503;
        res.status(statusCode).json(healthStatus);

    } catch (error) {
        logger.critical('Health check system failure', error);
        res.status(503).json({
            status: 'SYSTEM_FAILURE',
            timestamp: new Date().toISOString(),
            emergency: 'CRITICAL_SYSTEM_ISSUE',
            action: 'IMMEDIATE_ATTENTION_REQUIRED'
        });
    }
});

// 2. Business Reputation Endpoints
app.get('/api/businesses', async (req, res) => {
    try {
        const { limit = 20, offset = 0, search } = req.query;
        const safeLimit = Math.min(parseInt(limit), 100);
        const safeOffset = Math.max(0, parseInt(offset));

        let query = `
            SELECT id, name, description, rating, created_at, updated_at
            FROM businesses 
            WHERE status = 'active'
        `;
        let params = [];
        let paramCount = 0;

        if (search) {
            query += ` AND (name ILIKE $${++paramCount} OR description ILIKE $${paramCount})`;
            params.push(`%${MilitaryValidation.sanitizeInput(search)}%`);
        }

        query += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        params.push(safeLimit, safeOffset);

        const [businessesResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query('SELECT COUNT(*) as total FROM businesses WHERE status = $1', ['active'])
        ]);

        res.json({
            success: true,
            data: businessesResult.rows,
            pagination: {
                limit: safeLimit,
                offset: safeOffset,
                total: parseInt(countResult.rows[0].total),
                hasMore: (safeOffset + safeLimit) < parseInt(countResult.rows[0].total)
            },
            security: 'DATA_PROTECTED'
        });

    } catch (error) {
        logger.error('Business fetch operation failed', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve business data',
            referenceId: generateSecureId()
        });
    }
});

// 3. User Authentication Endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Military-grade validation
        if (!MilitaryValidation.validateEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        if (!MilitaryValidation.validatePassword(password)) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 8 characters'
            });
        }

        // Check if user exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1', 
            [MilitaryValidation.sanitizeInput(email)]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'User already exists'
            });
        }

        // Create user with secure password
        const hashedPassword = await auth.hashPassword(password);
        const result = await db.query(
            `INSERT INTO users (email, password, name, created_at) 
             VALUES ($1, $2, $3, NOW()) 
             RETURNING id, email, name, created_at`,
            [
                MilitaryValidation.sanitizeInput(email),
                hashedPassword,
                MilitaryValidation.sanitizeInput(name)
            ]
        );

        const token = auth.generateToken({
            userId: result.rows[0].id,
            email: result.rows[0].email
        });

        logger.info('New user registered successfully', {
            userId: result.rows[0].id,
            email: result.rows[0].email
        });

        res.status(201).json({
            success: true,
            data: {
                user: result.rows[0],
                token,
                expiresIn: config.security.jwtExpiresIn
            },
            message: 'User registered successfully'
        });

    } catch (error) {
        logger.error('User registration failed', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed - system error',
            referenceId: generateSecureId()
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password required'
            });
        }

        const userResult = await db.query(
            'SELECT id, email, password, name FROM users WHERE email = $1',
            [MilitaryValidation.sanitizeInput(email)]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const user = userResult.rows[0];
        const isValidPassword = await auth.verifyPassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const token = auth.generateToken({
            userId: user.id,
            email: user.email
        });

        // Remove password from response
        delete user.password;

        logger.info('User login successful', { userId: user.id, email: user.email });

        res.json({
            success: true,
            data: {
                user,
                token,
                expiresIn: config.security.jwtExpiresIn
            },
            message: 'Login successful'
        });

    } catch (error) {
        logger.error('User login failed', error);
        res.status(500).json({
            success: false,
            error: 'Login failed - system error',
            referenceId: generateSecureId()
        });
    }
});

// ========== ERROR HANDLING FOR SPECIAL FORCES ==========

// 404 - Not Found Handler
app.use('*', (req, res) => {
    logger.warn('404 Route not found', {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
        suggestion: 'Check API documentation',
        code: 'ROUTE_NOT_FOUND'
    });
});

// Global Error Handler (Nuclear Proof)
app.use((error, req, res, next) => {
    const errorId = generateSecureId();
    
    logger.critical('Global error handler triggered', error, {
        errorId,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    const errorResponse = {
        success: false,
        error: 'Internal server error',
        referenceId: errorId,
        timestamp: new Date().toISOString()
    };

    // Development details
    if (config.server.nodeEnv === 'development') {
        errorResponse.details = error.message;
        errorResponse.stack = error.stack;
    }

    res.status(500).json(errorResponse);
});

// ========== UTILITY FUNCTIONS ==========
function generateSecureId() {
    return `SECURE_${Date.now()}_${Math.random().toString(36).substr(2, 12)}_${process.pid}`;
}

// ========== GRACEFUL SHUTDOWN (MILITARY PRECISION) ==========
function setupMilitaryShutdown() {
    const shutdownSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGUSR2'];
    
    shutdownSignals.forEach(signal => {
        process.on(signal, async () => {
            logger.info(`🛑 Received ${signal} - Initiating military-grade shutdown`);
            
            let shutdownSuccessful = true;
            const shutdownStart = Date.now();

            try {
                // Close HTTP server
                if (server) {
                    await new Promise((resolve) => {
                        server.close((err) => {
                            if (err) {
                                logger.error('HTTP server close error', err);
                                shutdownSuccessful = false;
                            } else {
                                logger.info('✅ HTTP server closed gracefully');
                            }
                            resolve();
                        });
                    });
                }

                // Close database connections
                if (db && db.pool) {
                    try {
                        await db.pool.end();
                        logger.info('✅ Database connections closed gracefully');
                    } catch (error) {
                        logger.error('Database connection close error', error);
                        shutdownSuccessful = false;
                    }
                }

                const shutdownTime = Date.now() - shutdownStart;
                
                if (shutdownSuccessful) {
                    logger.info(`✅ Military-grade shutdown completed in ${shutdownTime}ms`);
                    process.exit(0);
                } else {
                    logger.warn(`⚠️ Shutdown completed with warnings in ${shutdownTime}ms`);
                    process.exit(1);
                }

            } catch (error) {
                logger.critical('CRITICAL shutdown failure', error);
                process.exit(1);
            }
        });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        logger.critical('UNCAUGHT EXCEPTION - SYSTEM IN DANGER', error);
        // In production, you might want to restart the process here
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.critical('UNHANDLED PROMISE REJECTION', reason, { promise });
        // In production, you might want to restart the process here
        process.exit(1);
    });
}

// ========== MILITARY-GRADE STARTUP SEQUENCE ==========
async function militaryStartup() {
    logger.info('🚀 INITIATING ULTRA-REPUTATION-SHIELD STARTUP SEQUENCE');
    
    try {
        // Phase 1: Database Connection
        logger.info('Phase 1: Establishing database connection...');
        const dbSuccess = await db.connectWithMilitaryPrecision();
        if (!dbSuccess) {
            throw new Error('DATABASE_CONNECTION_FAILED - SYSTEM HALTED');
        }

        // Phase 2: Server Initialization
        logger.info('Phase 2: Starting HTTP server...');
        const server = app.listen(config.server.port, () => {
            logger.info(`✅ SERVER OPERATIONAL - Port: ${config.server.port}`);
            logger.info(`🌐 Environment: ${config.server.nodeEnv}`);
            logger.info(`🔧 Health Check: http://localhost:${config.server.port}/health`);
            logger.info(`🎯 Client URL: ${config.security.corsOrigin}`);
            logger.info('🛡️ ULTRA REPUTATION SHIELD - ACTIVE AND MONITORING');
        });

        // Phase 3: Shutdown Protocols
        logger.info('Phase 3: Activating shutdown protocols...');
        setupMilitaryShutdown();

        // Phase 4: System Monitoring
        logger.info('Phase 4: Initializing system monitoring...');
        server.on('error', (error) => {
            logger.critical('SERVER ERROR DETECTED', error);
            if (error.code === 'EADDRINUSE') {
                logger.critical(`PORT ${config.server.port} IN USE - SYSTEM HALTED`);
                process.exit(1);
            }
        });

        logger.info('✅ ULTRA-REPUTATION-SHIELD STARTUP COMPLETE - SYSTEM SECURE');
        return server;

    } catch (error) {
        logger.critical('💥 STARTUP SEQUENCE FAILED - CRITICAL ERROR', error);
        process.exit(1);
    }
}

// ========== DEPLOYMENT VALIDATION ==========
logger.info('🔍 Validating deployment environment...');
logger.info('✅ Node.js Version:', process.version);
logger.info('✅ Platform:', process.platform);
logger.info('✅ Architecture:', process.arch);
logger.info('✅ PID:', process.pid);

// ========== ACTIVATE THE SHIELD ==========
militaryStartup().catch(error => {
    logger.critical('FATAL STARTUP ERROR - SHIELD OFFLINE', error);
    process.exit(1);
});

module.exports = { 
    app, 
    db, 
    config, 
    logger, 
    auth,
    MilitaryValidation 
};