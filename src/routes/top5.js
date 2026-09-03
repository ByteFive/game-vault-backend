import { Router } from "express";

import { get, create, update, remove } from "../controllers/top5.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/top5", authMiddleware, get);
router.post("/top5", authMiddleware, create);
router.put("/top5/:position", authMiddleware, update);
router.delete("/top5/:position", authMiddleware, remove);

export default router;
