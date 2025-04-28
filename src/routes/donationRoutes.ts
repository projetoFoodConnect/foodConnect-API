import { Router, Request, Response, NextFunction } from "express";
import { registerDonation, getDonationById, getDonationsByUser } from "../controllers/donationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/doacao", authenticateToken, registerDonation);
router.get("/doacao/:id", authenticateToken, getDonationById);
router.get("/doacoes/user", authenticateToken, getDonationsByUser);

export default router;