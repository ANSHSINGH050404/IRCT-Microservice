import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT ?? '4001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
  },
  redis_url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  OTP_EXPIRY_TIME: parseInt(process.env.OTP_EXPIRY_TIME ?? '5', 10),
  smtp: {
    host: process.env.SMTP_HOST ?? 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? 'noreply@irct.com',
  },

  OTP_SECRET: process.env.OTP_SECRET ?? 'default-secret',
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};
