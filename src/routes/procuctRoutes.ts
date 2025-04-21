import { Router } from "express";
import { cadastrarProduto, getProductById, getProductByUser, getProductByStatus } from "../controllers/productController";
import { upload } from "../middlewares/uploadImage";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/produto/cadastrar", authenticateToken, upload.single("imagem"), cadastrarProduto);
router.get("/produto/:id", authenticateToken, getProductById);
router.get("/produtos", authenticateToken, getProductByUser);
router.get("/produtos/:status", getProductByStatus);

export default router;
