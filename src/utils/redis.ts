import Redis from 'ioredis';
import { config } from '../config';

class RedisClient {
  private static instance: Redis;

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
      RedisClient.instance.connect().catch(() => {});
    }
    return RedisClient.instance;
  }
}

export default RedisClient;
