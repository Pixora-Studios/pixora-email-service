import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/env';
import apiRouter from './routes/api';
import { globalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // allow loading client assets in dev/embedded
}));

app.use(cors({
  origin: config.allowedOrigins === '*' ? '*' : config.allowedOrigins.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-admin-key'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiter
app.use('/api', globalRateLimiter);

// Mount API routes
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter); // Alias

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'pixora-email-service',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// Serve client in production if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <head><title>Pixora Email Service API</title></head>
          <body style="font-family: system-ui; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
            <h1 style="color: #38bdf8;">Pixora Email Service API is Running</h1>
            <p>Port: ${config.port} | Mode: ${config.nodeEnv}</p>
            <p>Access the React Dashboard by running <code>npm run dev</code> or visiting the client port.</p>
          </body>
        </html>
      `);
    }
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log('====================================================');
  console.log(`🚀 Pixora Universal Email Service running on port ${config.port}`);
  console.log(`📡 Base URL: ${config.baseUrl}`);
  console.log(`🔑 Master Admin Key loaded: ${config.masterAdminKey.substring(0, 8)}...`);
  console.log(`📧 Default Sender: "${config.fromName}" <${config.fromEmail}>`);
  console.log('====================================================');
});

export default app;
