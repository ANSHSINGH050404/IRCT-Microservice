import { BadRequestError } from "../utils/error";
import { config } from "../config";
import * as authService from "../services/auth.service";

export const sendOtp = async(req: any, res: any, next: any) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstName = req.body.firstName ?? req.body.firstname;
    const lastName = req.body.lastName ?? req.body.lastname;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      throw new BadRequestError("All fields are required");
    }

    if (password !== confirmPassword) {
      throw new BadRequestError("Passwords do not match");
    }

    const { otpSessionId } = await authService.sendOtp(firstName, lastName, email, password);

    res.cookie("otpSessionId", otpSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: config.OTP_EXPIRY_TIME * 1000,
    }).status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
}

export const verifyOTP = async (req: any, res: any, next: any) => {
  const { otp } = req.body;
  const otpSessionId = req.cookies.otpSessionId;

  if (!otp || !otpSessionId) {
    throw new BadRequestError("OTP and session ID are required");
  }

  const result = await authService.verifyOTP(otp, otpSessionId);

  res.status(200).json(result);
}