import { Router } from "express";
import { login, rotateRefreshToken, sendOtp, verifyOTP } from "../controllers/auth.controller";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/refresh-token", rotateRefreshToken);

export default router;
