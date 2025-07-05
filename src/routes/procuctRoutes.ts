import { Router } from "express";
import { registerProduct, getProductById, getProductByUser, getProductByStatus, getAllProducts, updateProduct, deleteProduct } from "../controllers/productController";
import { upload } from "../middlewares/uploadImage";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/produto/user", authenticateToken, getProductByUser);
router.get("/produto/:status", getProductByStatus);
router.post("/produto/cadastrar", authenticateToken, upload.single("imagem"), registerProduct);
router.get("/produto/:id", authenticateToken, getProductById);
router.get("/produto", getAllProducts);
router.put("/produto/:id", authenticateToken, upload.single("imagem"), updateProduct);
router.put("/produto/delete/:id", authenticateToken, deleteProduct);

export default router;
