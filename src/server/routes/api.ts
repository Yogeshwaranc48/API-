import { Router } from 'express';

const router = Router();

/**
 * GET /api
 * General API health check endpoint.
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Rate Limited API!',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/users
 * Returns a sample list of users.
 */
router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]
  });
});

export default router;
