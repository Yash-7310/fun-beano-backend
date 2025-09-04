import express from "express";
import { loginUser, registerUser, verifySession } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/verify', authenticate, verifySession);


export default router;