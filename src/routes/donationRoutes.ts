import { Router, Request, Response, NextFunction } from "express";
import { registerDonation, getDonationById } from "../controllers/donationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/doacao", authenticateToken, registerDonation);
router.get("/doacao/:id", authenticateToken, getDonationById);

export default router;