import { Router } from "express";

import { get, create, update, remove } from "../controllers/top5.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/top5", authMiddleware, get);
router.post("/top5", authMiddleware, create);
router.put("/top5/:position", authMiddleware, update); // A alteração de posição não é permitida, pois a posição de destino já pode estar ocupada, violando as regras de unicidade do Top 5.
router.delete("/top5/:position", authMiddleware, remove);

export default router;
