import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`API Gateway running on http://localhost:${config.port} [${config.nodeEnv}]`);
});

const gracefulShutdown = () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
