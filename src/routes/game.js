import { Router } from "express";
import { findGames } from "../controllers/game.js";
import { findGameById } from "../controllers/game.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/games", authMiddleware, findGames);
router.get("/games/:id", authMiddleware, findGameById);

export default router;
