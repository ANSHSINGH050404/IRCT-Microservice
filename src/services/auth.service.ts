
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import { verifyOtp } from "../utils/sendEmail";
import { generateOtpAndStore } from "../utils/generateOtpAndStore";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth";
import { BadRequestError, UnauthorizedError } from "../utils/error";
import RedisClient from "../config/redis";
import { config } from "../config";
import { NotificationProducer } from "../kafka/producer/notification.producer";
import { logger } from "../config/logger"

const redis = RedisClient.getInstance();
const notificationProducer = new NotificationProducer();

export const sendOtp = async(firstName: string, lastName: string, email: string, password: string) => {

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const meta = {
      firstName,
      lastName,
      email,
    hashedPassword,
    };
    const {otp, otpSessionId} = await generateOtpAndStore(meta);
    await notificationProducer.sendOTPAndEmail(email, otp, config.OTP_EXPIRY_TIME);
    logger.info(`OTP sent to ${email} with expiry time ${config.OTP_EXPIRY_TIME} minutes`);
    return { otpSessionId };
}


export const verifyOTP = async (otp: string, otpSessionId: string) => {
  const { message, meta } = await verifyOtp(otp, otpSessionId);

  const user = await prisma.user.create({
    data: {
      firstName: meta.firstName,
      lastName: meta.lastName,
      email: meta.email,
      password: meta.hashedPassword,
      emailVerified: true,
    },
  });

  const { password: _, ...loggedUser } = user;

  return { message, user: loggedUser };
}

export const login = async (email: string, password: string, deviceId: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new BadRequestError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);
  const { token: refreshToken, jti } = generateRefreshToken(user.id);

  await redis.set(`refresh_token:${jti}`, user.id, "EX", config.REFRESH_TOKEN_EXPIRY_TIME);

  const { password: _, ...loggedUser } = user;

  return { accessToken, refreshToken, loggedUser };
}

export const rotateRefreshToken = async (oldRefreshToken: string, deviceId: string) => {
  const payload = verifyRefreshToken(oldRefreshToken);

  const storedUserId = await redis.get(`refresh_token:${payload.jti}`);
  if (!storedUserId || storedUserId !== payload.id) {
    throw new UnauthorizedError("Refresh token has been revoked");
  }

  await redis.del(`refresh_token:${payload.jti}`);

  const accessToken = generateAccessToken(payload.id);
  const { token: newRefreshToken, jti } = generateRefreshToken(payload.id);

  await redis.set(`refresh_token:${jti}`, payload.id, "EX", config.REFRESH_TOKEN_EXPIRY_TIME);

  return { accessToken, refreshToken: newRefreshToken };
}