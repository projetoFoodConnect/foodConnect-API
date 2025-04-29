import { Router, Request, Response, NextFunction } from "express";
import { registerDonation, getDonationById, getDonationsByUser, getAllDonations, updateDonation } from "../controllers/donationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/doacao", authenticateToken, registerDonation);
router.get("/doacao/:id", authenticateToken, getDonationById);
router.get("/doacoes/user", authenticateToken, getDonationsByUser);
router.get("/doacoes", authenticateToken, getAllDonations);
router.put("/doacao/:id", authenticateToken, updateDonation);

export default router;