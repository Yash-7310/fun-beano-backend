import express from "express";
import { loginVendor, registerUser, registerVendor, verifyOtp, verifyVendor } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.get('/verify', authenticate, verifyVendor);

// user
router.post("/send-otp", registerUser);
router.post("/verify-otp", verifyOtp);


export default router;