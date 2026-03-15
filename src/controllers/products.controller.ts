import { Request, Response } from "express";
import {
  getAllProducts,
  getProductDetail,
  getInventoryStats
} from "../services/products.service";

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await getAllProducts(req.query as Record<string, string>);
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    const product = await getProductDetail(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product detail",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function getStats(_req: Request, res: Response) {
  try {
    const stats = await getInventoryStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving inventory stats",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}