import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { configureSecurityMiddlewares } from './src/server/middlewares/security.js';
import { errorHandler } from './src/server/middlewares/errorHandler.js';
import { generalLimiter } from './src/server/middlewares/rateLimiter.js';
import apiRoutes from './src/server/routes/api.js';
import authRoutes from './src/server/routes/auth.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Trust proxy (Required if behind a reverse proxy like Nginx or cloud provider)
  // This ensures req.ip correctly identifies the client IP rather than the proxy's IP.
  app.set('trust proxy', 1);

  // 2. Parse JSON payloads
  app.use(express.json());

  // 3. Apply general security and optimization middlewares
  configureSecurityMiddlewares(app);

  // 4. Apply rate limiters to API routes
  // The general limiter is applied to all /api routes except those specifically overridden
  app.use('/api', generalLimiter);

  // 5. Mount API Routes
  app.use('/api', apiRoutes);
  app.use('/api', authRoutes);

  // Health check route
  app.get('/health', (req, res) => res.send('API is running'));

  // 6. Vite middleware for frontend development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 7. Centralized Error Handling
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Rate limits active:`);
    console.log(` - General API: 100 requests per 15 minutes`);
    console.log(` - Login Route: 5 requests per 15 minutes`);
  });
}

startServer();
