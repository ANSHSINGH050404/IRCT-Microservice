import 'dotenv/config';

export const config = {
  port: parseInt(process.env.GATEWAY_PORT ?? '4000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? 'default-secret',

  services: [
    { prefix: '/api/v1/auth', target: 'http://localhost:4001' },
    { prefix: '/api/v1/user', target: 'http://localhost:4001' },
  ],

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10),
    maxDefault: parseInt(process.env.RATE_LIMIT_MAX_DEFAULT ?? '100', 10),
    routes: {
      '/api/v1/auth/send-otp': { max: 5 },
      '/api/v1/auth/login': { max: 10 },
    },
  },

  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};
