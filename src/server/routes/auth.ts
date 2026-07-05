import { Router } from 'express';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

/**
 * POST /api/login
 * Simulates a login endpoint.
 * Protected by a strict rate limiter (5 requests / 15 mins).
 */
router.post('/login', loginLimiter, (req, res) => {
  // In a real application, you would validate credentials here
  res.json({
    success: true,
    message: 'Login successful',
    token: 'fake-jwt-token-for-demo'
  });
});

export default router;
