import { Router } from "express";
import { registerUser } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/user/register", async (req, res, next) => {
    try {
      await registerUser(req, res);
    } catch (error) {
      next(error);
    }
});

export default router;