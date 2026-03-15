import fs from "fs/promises";
import path from "path";
import { db } from "../config/db";
import { Product } from "../types/product";

const PRODUCTS_FILE = path.join(__dirname, "..", "..", "data", "products.json");

async function main() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      stock INTEGER NOT NULL,
      supplier TEXT NOT NULL,
      country_code TEXT NOT NULL
    );
  `);

  const raw = await fs.readFile(PRODUCTS_FILE, "utf-8");
  const products = JSON.parse(raw) as Product[];

  await db.query("DELETE FROM products");

  for (const product of products) {
    await db.query(
      `
      INSERT INTO products (id, name, category, price, stock, supplier, country_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        product.id,
        product.name,
        product.category,
        product.price,
        product.stock,
        product.supplier,
        product.countryCode
      ]
    );
  }

  console.log(`Seeded ${products.length} products`);
  await db.end();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});