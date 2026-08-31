import { Router } from "express";
import { getProfileController } from "../controllers/profile.js";
import { authMiddleware } from "../middlewares/auth.js";


const router = Router();

router.get("/profile", authMiddleware, getProfileController);

export default router;