import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../../../notification-service/config/logger';
import RedisClient from '../config/redis';

const redis = RedisClient.getInstance();

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }
  return transporter;
}

export const sendEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: config.smtp.from,
    to: email,
    subject: 'Your OTP for IRCT Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your One-Time Password (OTP) for registration is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; 
             padding: 16px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for ${config.OTP_EXPIRY_TIME} minutes.</p>
        <p style="color: #6b7280; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    logger.info(`OTP email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${email}: ${error}`);
    throw new Error('Failed to send OTP email');
  }
};


export const verifyOtp = async (otp: string, otpSessionId: string) => {
    const rawdata = await redis.get(`otp:session:${otpSessionId}`);

    if (!rawdata) {
        throw new Error("OTP session not found or expired");
    }

    const isOtpValid = await bcrypt.compare(otp, rawdata);

    if (!isOtpValid) {
        throw new Error("Invalid OTP");
    }

    const metaRaw = await redis.get(`otp:meta:${otpSessionId}`);
    if (!metaRaw) {
        throw new Error("OTP session data not found");
    }
    const meta = JSON.parse(metaRaw);

    await redis.del(`otp:session:${otpSessionId}`);
    await redis.del(`otp:meta:${otpSessionId}`);

    return { message: "OTP verified successfully", meta };
};
