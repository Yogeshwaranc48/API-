import rateLimit from 'express-rate-limit';

/**
 * Custom error handler for rate limit exceeded
 */
const rateLimitHandler = (req: any, res: any) => {
  res.status(429).json({
    success: false,
    message: "Too many requests. Please try again later."
  });
};

/**
 * General API Rate Limiter
 * Limits each IP to 100 requests per 15 minutes.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] General API limit exceeded by IP: ${req.ip}`);
    rateLimitHandler(req, res);
  }
});

/**
 * Stricter Login Route Rate Limiter
 * Limits each IP to 5 requests per 15 minutes to prevent brute-force attacks.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Login API limit exceeded by IP: ${req.ip}`);
    rateLimitHandler(req, res);
  }
});
