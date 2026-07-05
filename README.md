# Express API Rate Limiting Project

## Project Overview
This project demonstrates how to implement robust API rate limiting in a Node.js and Express.js application. It is designed as an internship-ready backend project showcasing API security best practices. The application protects general API routes from abuse and applies a stricter security policy to sensitive routes, such as user login.

## Features
- **Node.js & Express.js** backend architecture.
- **API Rate Limiting** using the `express-rate-limit` package.
- **General Limiter**: Restricts IPs to 100 requests per 15 minutes for standard API endpoints.
- **Strict Limiter**: Restricts IPs to 5 requests per 15 minutes for the `/api/login` endpoint.
- **Security Middlewares**: Integrated `helmet`, `cors`, and `compression`.
- **Centralized Error Handling**: Clean, consistent JSON error responses.
- **Custom 429 Responses**: Returns structured JSON payloads when limits are exceeded.
- **React Dashboard**: Includes a frontend UI to interactively test the rate limiters.

## Technologies Used
- Node.js
- Express.js
- express-rate-limit
- Helmet
- CORS
- Compression
- React & Tailwind CSS (for the testing dashboard)

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/express-rate-limiting.git
   cd express-rate-limiting
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Required Dependencies
- `express`: Fast, unopinionated, minimalist web framework.
- `express-rate-limit`: Basic rate-limiting middleware for Express.
- `helmet`: Helps secure Express apps with various HTTP headers.
- `cors`: Express middleware to enable CORS.
- `compression`: Node.js compression middleware.

## How to Run the Project

**Development Mode (Full Stack)**:
```bash
npm run dev
```
This boots both the Express API and the Vite frontend on port 3000.

**Production Build**:
```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api` | General health check | 100 / 15 mins |
| GET | `/api/users` | Retrieve mock user data | 100 / 15 mins |
| POST | `/api/login` | Simulate user authentication | 5 / 15 mins |

## Rate Limiting Configuration & How it Works

The `express-rate-limit` package works by tracking the IP address of incoming requests. It maintains a memory store (by default) of how many requests each IP has made within a specified time window (`windowMs`).

- **IP-Based Tracking**: The middleware uses `req.ip` to identify users. If the app is behind a reverse proxy (like Nginx, Heroku, or Cloud Run), we set `app.set('trust proxy', 1)` so that Express correctly reads the client's IP from the `X-Forwarded-For` header rather than the proxy's IP.
- **Standard Headers**: The middleware sends `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` headers so clients know their current status.

## Why Rate Limiting is Important for API Security
- **Prevents Brute-Force Attacks**: Attackers cannot guess passwords rapidly if the login route is strictly limited.
- **Mitigates DDoS Attacks**: Prevents a single IP from overwhelming the server with requests, ensuring availability for legitimate users.
- **Controls Costs**: Prevents abuse of paid third-party APIs by limiting outbound requests.

## Testing using Postman and curl

**Using curl (Success):**
```bash
curl -X GET http://localhost:3000/api
```

**Using curl (Triggering the 429 Error on Login):**
Run this 6 times rapidly:
```bash
curl -X POST http://localhost:3000/api/login
```

## Example Successful Responses
```json
{
  "success": true,
  "message": "Welcome to the Rate Limited API!",
  "timestamp": "2026-07-05T12:00:00.000Z"
}
```

## Example HTTP 429 (Too Many Requests) Response
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

## Future Improvements
- **Redis Store**: Replace the default in-memory store with Redis (`rate-limit-redis`) for distributed deployments and persistence across server restarts.
- **User-Based Limiting**: Limit based on authenticated user IDs (`req.user.id`) rather than just IP addresses.
- **Dynamic Limits**: Adjust rate limits dynamically based on the user's subscription tier.

## GitHub Repository Structure
```text
.
├── src/
│   ├── server/
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── security.ts
│   │   └── routes/
│   │       ├── api.ts
│   │       └── auth.ts
│   ├── App.tsx          # React test dashboard
│   ├── main.tsx
│   └── index.css
├── server.ts            # Express Entry Point
├── package.json
├── README.md
└── LICENSE
```
