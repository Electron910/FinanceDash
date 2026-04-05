import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
    skip: (req) => req.url === '/api/health' || req.url === '/',
  })
);

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'FinanceDash API Docs',
    customCss: `
      .swagger-ui .topbar { background-color: #2C3930; }
      .swagger-ui .topbar-wrapper img { content: url(''); }
      .swagger-ui .info .title { color: #A27B5C; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  })
);

app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', (_req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>FinanceDash API</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #2C3930;
          color: #DCD7C9;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .container {
          max-width: 640px;
          width: 100%;
          text-align: center;
        }
        .logo {
          width: 72px; height: 72px;
          background: #A27B5C;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #2C3930;
          font-weight: bold;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 40px rgba(162,123,92,0.4);
        }
        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #DCD7C9;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: rgba(220,215,201,0.5);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .status-box {
          background: rgba(63,79,68,0.6);
          border: 1px solid rgba(162,123,92,0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }
        .status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.875rem;
        }
        .status-row:last-child { border-bottom: none; }
        .status-label { color: rgba(220,215,201,0.5); }
        .status-value { color: #DCD7C9; font-weight: 500; }
        .badge-green {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.3);
          padding: 2px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
        }
        .routes {
          background: rgba(44,57,48,0.8);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: left;
          margin-bottom: 1.5rem;
        }
        .routes h3 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(220,215,201,0.4);
          margin-bottom: 1rem;
        }
        .route-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.375rem 0;
          font-size: 0.8125rem;
        }
        .method {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          min-width: 48px;
          text-align: center;
        }
        .get    { background: rgba(96,165,250,0.15); color: #60a5fa; }
        .post   { background: rgba(74,222,128,0.15); color: #4ade80; }
        .put    { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .delete { background: rgba(248,113,113,0.15); color: #f87171; }
        .route-path { color: rgba(220,215,201,0.7); font-family: monospace; }
        .cta {
          display: inline-block;
          background: #A27B5C;
          color: #2C3930;
          font-weight: 700;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.9rem;
          box-shadow: 0 0 24px rgba(162,123,92,0.4);
          transition: all 0.2s ease;
        }
        .cta:hover { background: rgba(162,123,92,0.85); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">₣</div>
        <h1>FinanceDash API</h1>
        <p class="subtitle">Backend REST API — v1.0.0</p>

        <div class="status-box">
          <div class="status-row">
            <span class="status-label">Status</span>
            <span class="badge-green">● Running</span>
          </div>
          <div class="status-row">
            <span class="status-label">Environment</span>
            <span class="status-value">${process.env.NODE_ENV || 'development'}</span>
          </div>
          <div class="status-row">
            <span class="status-label">Port</span>
            <span class="status-value">${PORT}</span>
          </div>
          <div class="status-row">
            <span class="status-label">Timestamp</span>
            <span class="status-value">${new Date().toISOString()}</span>
          </div>
          <div class="status-row">
            <span class="status-label">Frontend URL</span>
            <span class="status-value">${process.env.FRONTEND_URL || 'http://localhost:3000'}</span>
          </div>
        </div>

        <div class="routes">
          <h3>Available Endpoints</h3>

          <div class="route-item">
            <span class="method get">GET</span>
            <span class="route-path">/api/health</span>
          </div>
          <div class="route-item">
            <span class="method post">POST</span>
            <span class="route-path">/api/auth/login</span>
          </div>
          <div class="route-item">
            <span class="method get">GET</span>
            <span class="route-path">/api/auth/me</span>
          </div>
          <div class="route-item">
            <span class="method get">GET</span>
            <span class="route-path">/api/transactions</span>
          </div>
          <div class="route-item">
            <span class="method post">POST</span>
            <span class="route-path">/api/transactions</span>
          </div>
          <div class="route-item">
            <span class="method put">PUT</span>
            <span class="route-path">/api/transactions/:id</span>
          </div>
          <div class="route-item">
            <span class="method delete">DELETE</span>
            <span class="route-path">/api/transactions/:id</span>
          </div>
          <div class="route-item">
            <span class="method get">GET</span>
            <span class="route-path">/api/dashboard</span>
          </div>
          <div class="route-item">
            <span class="method get">GET</span>
            <span class="route-path">/api/users</span>
          </div>
        </div>

        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta">
          → Open Dashboard UI
        </a>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FinanceDash API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: `${Math.floor(process.uptime())}s`,
    endpoints: {
      auth:         '/api/auth',
      users:        '/api/users',
      transactions: '/api/transactions',
      dashboard:    '/api/dashboard',
    },
  });
});

app.use('/api/auth',         authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard',    dashboardRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════╗
║       FinanceDash API Started          ║
╠════════════════════════════════════════╣
║  Backend  → http://localhost:${PORT}      ║
║  Frontend → http://localhost:3000      ║
║  Health   → http://localhost:${PORT}/api/health ║
╚════════════════════════════════════════╝`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;