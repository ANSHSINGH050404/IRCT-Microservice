import Redis from 'ioredis';
import { logger } from './logger';
import { config } from './index';


class RedisClient {

    static instance: Redis;
    static isConnected = false;
    private static errorHandlerAttached = false;

    constructor(){}

    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis(
                config.redis_url,
                {
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
                lazyConnect: true,
            });
            RedisClient.instance.connect().catch(() => {});
        }
        if (!RedisClient.errorHandlerAttached) {
            RedisClient.instance.on("error", (err) => {
                RedisClient.isConnected = false;
                logger.error(`Redis connection error: ${err?.message ?? "Unknown"}`);
            });
            RedisClient.instance.on("connect", () => {
                RedisClient.isConnected = true;
                logger.info("Redis connected");
            });
            RedisClient.instance.on("close", () => {
                RedisClient.isConnected = false;
            });
            RedisClient.errorHandlerAttached = true;
        }
        return RedisClient.instance;
    }
}


export default RedisClient;
