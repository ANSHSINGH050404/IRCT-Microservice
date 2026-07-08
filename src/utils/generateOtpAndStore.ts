import bcrypt from 'bcrypt';
import { randomUUID } from "node:crypto";
import { config } from "../config";
import RedisClient from "../config/redis";

const redis = RedisClient.getInstance();

export async function generateOtpAndStore(meta: any) {
  const rateKey = `otp:${meta.email}`;
  const sendRateLimit = await redis.get(rateKey);
  const sendCount = sendRateLimit ? parseInt(sendRateLimit) : 0;
  if (sendCount >= 5) {
    throw new Error("OTP send limit exceeded");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpSessionId = randomUUID();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await redis.set(`otp:session:${otpSessionId}`, hashedOtp, "EX", config.OTP_EXPIRY_TIME * 60);
  await redis.set(`otp:meta:${otpSessionId}`, JSON.stringify(meta), "EX", config.OTP_EXPIRY_TIME * 60);
  await redis.incr(rateKey);
  await redis.expire(rateKey, 60 * 60);

  return { otp, otpSessionId };
}
