import Redis from 'ioredis';
import { logger } from './logger';
import { config } from './index';


class RedisClient {

    static instance: Redis;
    static isConnected = false;

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
            });
            RedisClient.isConnected = true;
        }
        return RedisClient.instance;
    }
}


export default RedisClient;
