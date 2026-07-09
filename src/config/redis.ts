import { Redis } from "ioredis";
import { config } from "./index";

let instance: Redis | null = null;

function getInstance(): Redis {
  if (!instance) {
    instance = new Redis(config.redis_url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    instance.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    instance.on("connect", () => {
      console.log("Connected to Redis");
    });

    instance.on("close", () => {
      console.log("Redis connection closed");
    });
  }
  return instance;
}

const RedisClient = { getInstance };

export default RedisClient;
