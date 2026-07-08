import { createHmac, randomUUID } from "node:crypto";
import { config } from "../config";
import RedisClient from "../config/redis";

const redis = RedisClient.getInstance();

function hmacFor(email: string, otp: string) {
  return createHmac("sha256", config.OTP_SECRET).update(`${email}:${otp}`).digest("hex");
}

export async function generateOtpAndStore(meta: any) {
  const rateKey = `otp:${meta.email}`;
  const sendRateLimit = await redis.get(rateKey);
  const sendCount = sendRateLimit ? parseInt(sendRateLimit) : 0;
  if (sendCount >= 5) {
    throw new Error("OTP send limit exceeded");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpSessionId = randomUUID();
  const hashedOtp = hmacFor(meta.email, otp);

  await redis.set(`otp:${meta.email}:${otpSessionId}`, hashedOtp, "EX", config.OTP_EXPIRY_TIME);
  await redis.incr(rateKey);
  await redis.expire(rateKey, 60 * 60);

  return { otp, otpSessionId };
}
