import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  addGame,
  getGame,
  deleteGame,
  updateGame,
} from "../controllers/library.js";

const router = Router();

router.get("/library", authMiddleware, getGame);
router.post("/library", authMiddleware, addGame);
router.put("/library/:gameId", authMiddleware, updateGame);
router.delete("/library/:gameId", authMiddleware, deleteGame);

export default router;
