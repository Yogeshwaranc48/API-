import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handler middleware.
 * Catches any errors passed to next(err) and formats them into a standard JSON response.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
