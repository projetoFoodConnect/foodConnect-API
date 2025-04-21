import { Router } from "express";
import { cadastrarProduto } from "../controllers/productController";
import { upload } from "../middlewares/uploadImage";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/produto/cadastrar", authenticateToken, upload.single("imagem"), cadastrarProduto);

export default router;
