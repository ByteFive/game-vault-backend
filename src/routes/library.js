import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import{
    addGame,
    getGame,
    deleteGame,
    updateGame,
} from "../controllers/library.js"

const router = Router();

router.post("/library", authMiddleware, addGame);
router.get("/library", authMiddleware, getGame);
router.delete("/library/:gameId", authMiddleware, deleteGame);
router.put("/library/:gameId", authMiddleware, updateGame)

export default router;


