import { Router } from "express";
import {
  getProducts,
  getProductById,
  getStats
} from "../controllers/products.controller";

const router = Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/stats", getStats);

export default router;