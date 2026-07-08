import { BadRequestError } from "../utils/error";
import { config } from "../config";
import * as authService from "../services/auth.service";

export const sendOtp = async(req: any, res: any, next: any) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      throw new BadRequestError("All fields are required");
    }

    if (password !== confirmPassword) {
      throw new BadRequestError("Passwords do not match");
    }

    const { optSessionId } = await authService.sendOtp(firstName, lastName, email, password);

    res.cookie("optSessionId", optSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: config.OTP_EXPIRY_TIME * 1000,
    }).status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
}