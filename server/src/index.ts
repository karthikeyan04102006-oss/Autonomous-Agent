import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, isRealSupabaseSecretConfigured } from './config/env.js';
import agentRoutes from './routes/agentRoutes.js';
import { supabaseService } from './services/supabase.service.js';

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline styles & scripts for frontend dev
}));

// CORS Configuration - Allow Frontend URL
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json());

// Request logging middleware (Never print secret keys in console logs)
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// GET /api/health - Direct health endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  const supabaseConn = await supabaseService.checkConnection();
  res.json({
    status: 'ok',
    service: 'AgentFlow Backend',
    supabase: supabaseConn
  });
});

// Mount Agent API Routes
app.use('/api', agentRoutes);

// Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Backend Global Error]:', err.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`
=====================================================
🚀 AGENTFLOW BACKEND ENGINE ACTIVE
📡 Running at: http://localhost:${config.port}
🌐 Allowed Frontend: ${config.frontendUrl}
🗄️ Supabase URL: ${config.supabaseUrl}
🔑 Supabase Secret Key: ${isRealSupabaseSecretConfigured() ? '✅ Valid Configured' : '⚠️ Placeholder / Demo Fallback Mode'}
🤖 Gemini AI API: ${config.geminiApiKey ? '✅ Configured' : '⚠️ Placeholder / Demo Fallback Mode'}
=====================================================
  `);
});
