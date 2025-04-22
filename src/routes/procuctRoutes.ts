import { Router } from "express";
import { cadastrarProduto, getProductById, getProductByUser, getProductByStatus, getAllProducts } from "../controllers/productController";
import { upload } from "../middlewares/uploadImage";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/produto/cadastrar", authenticateToken, upload.single("imagem"), cadastrarProduto);
router.get("/produto/:id", authenticateToken, getProductById);
router.get("/produto/user", authenticateToken, getProductByUser);
router.get("/produto/:status", getProductByStatus);
router.get("/produto", getAllProducts);

export default router;
