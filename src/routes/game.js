import { Router } from "express";
import { findGames } from "../controllers/games.js";
import { findGameById } from "../controllers/games.js";

const router = Router();

router.get("/games", findGames);
router.get("/games", findGameById );

export default router;
