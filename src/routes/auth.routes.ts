import { Router } from "express";
import { login, sendOtp, verifyOTP } from "../controllers/auth.controller";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

export default router;
