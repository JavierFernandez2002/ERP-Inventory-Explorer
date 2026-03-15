import { db } from "../config/db";
import { getCountryInfo } from "./countries.service";
import { Product, ProductDetail } from '../types/product';

interface ProductsQuery {
    search?: string;
    category?: string;
    inStock?: string;
    sortBy?: string;
    order?: string;
    page?: number | string;
    limit?: number | string;
}

export async function getAllProducts(query: ProductsQuery = {}) {
    const { 
        search,
        category, 
        inStock, 
        sortBy = "name", 
        order= "asc", 
        page=1, 
        limit=6 
    } = query;
    
    const currentPage = Number(page);
    const pageSize = Number(limit);
    const offset = (currentPage - 1) * pageSize;

    const conditions: string[] = [];
    const values: Array<string | number> = [];
    let paramIndex = 1;

    if (search) {
        conditions.push(`(LOWER(name) LIKE $${paramIndex} OR LOWER(category) LIKE $${paramIndex})`);
        values.push(`%${search.toLowerCase()}%`);
        paramIndex++;
    }

    if (category) {
        conditions.push(`LOWER(category) = LOWER($${paramIndex})`);
        values.push(category.toLowerCase());
        paramIndex++;
    }

    if (inStock) {
        conditions.push(`stock > 0`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortFields = ['name', 'price'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const safeOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const dataQuery = `
    SELECT
      id,
      name,
      category,
      price::float AS price,
      stock,
      supplier,
      country_code AS "countryCode"
    FROM products
    ${whereClause}
    ORDER BY ${safeSortBy} ${safeOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS count FROM products
    ${whereClause}
  `;

  const dataValues = [...values, pageSize, offset];

  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, dataValues),
    db.query(countQuery, values)
  ]);

  const totalItems = countResult.rows[0].count as number;
  const totalPages = Math.ceil(totalItems / pageSize);

    return {
        data: dataResult.rows as Product[],
        pagination: {
            page: currentPage,
            limit: pageSize,
            totalItems,
            totalPages
        }
    };
}

export async function getProductDetail(id: number): Promise<ProductDetail | null> {
    const result = await db.query(
    `
    SELECT
      id,
      name,
      category,
      price::float AS price,
      stock,
      supplier,
      country_code AS "countryCode"
    FROM products
    WHERE id = $1
    `,
    [id]
  );

  const product = result.rows[0] as Product;

    if (!product) {
        return null;
    }

    const country = await getCountryInfo(product.countryCode);

    return {
        ...product,
        country
    };
}

export async function getInventoryStats(){
    const [generalResult, categoriesResult] = await Promise.all([
        db.query(`
            SELECT
                COUNT(*):: int AS totalProducts,
                COUNT(*) FILTER (WHERE stock <= 5) AS lowStockCount,
                ROUND(AVG(price), 2)::float AS averagePrice
            FROM products
        `),
        db.query(`
            SELECT category, COUNT(*)::int AS count
            FROM products
            GROUP BY category
            ORDER BY category
            `)
    ]);
    const categories = categoriesResult.rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.category] = row.count;
        return acc;
    }, {});

    return {
        ...generalResult.rows[0],
        productsByCategory: categories
    };
}