import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { Express } from 'express';

/**
 * Configures security and optimization middlewares for the Express application.
 */
export const configureSecurityMiddlewares = (app: Express) => {
  // Helmet helps secure Express apps by setting various HTTP headers
  // Configured to allow AI Studio iframe preview
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    xFrameOptions: false,
  }));

  // CORS middleware to enable Cross-Origin Resource Sharing
  app.use(cors());

  // Compression middleware to compress response bodies for performance
  app.use(compression());
};
