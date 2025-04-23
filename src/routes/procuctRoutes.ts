import { Router } from "express";
import { cadastrarProduto, getProductById, getProductByUser, getProductByStatus, getAllProducts, updateProduct, deleteProduct } from "../controllers/productController";
import { upload } from "../middlewares/uploadImage";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/produto/cadastrar", authenticateToken, upload.single("imagem"), cadastrarProduto);
router.get("/produto/:id", authenticateToken, getProductById);
router.get("/produto/user", authenticateToken, getProductByUser);
router.get("/produto/:status", getProductByStatus);
router.get("/produto", getAllProducts);
router.put("/produto/:id", authenticateToken, upload.single("imagem"), updateProduct);
router.delete("/produto/:id", authenticateToken, deleteProduct);

export default router;
