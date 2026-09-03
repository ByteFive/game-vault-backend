import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getByGameId,
  getByUser,
  deleteReview,
  createReview,
  updateReview,
} from "../controllers/rating.js";

const router = Router();

router.get("/rating", authMiddleware, getByUser);
router.get("/rating/:gameId", authMiddleware, getByGameId);
router.post("/rating", authMiddleware, createReview);
router.put("/rating/:id", authMiddleware, updateReview);
router.delete("/rating/:id", authMiddleware, deleteReview);

export default router;