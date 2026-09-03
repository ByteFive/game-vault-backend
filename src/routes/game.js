import { Router } from "express";
import { findGames } from "../controllers/game.js";
import { findGameById } from "../controllers/game.js";

const router = Router();

router.get("/games", findGames);
router.get("/games/:id", findGameById );

export default router;
