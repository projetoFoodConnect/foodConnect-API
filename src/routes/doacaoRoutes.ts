import { Router, Request, Response, NextFunction } from "express";
import { criarDoacao } from "../controllers/doacaoController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/doacao", authenticateToken, criarDoacao);

export default router;