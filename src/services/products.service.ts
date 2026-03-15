import fs  from 'fs/promises';
import path from 'path';
import {
    searchProducts,
    filterByCategory,
    filterByStock,
    sortProducts,
} from '../utils/products.utils';
import { getCountryInfo } from "./countries.service";
import { Product, ProductDetail } from '../types/product';

const PRODUCTS_FILE = path.join(__dirname, '../..', 'data', 'products.json');

interface ProductsQuery {
    search?: string;
    category?: string;
    inStock?: string;
    sortBy?: string;
    order?: string;
    page?: number | string;
    limit?: number | string;
}

export async function readProductsFile(): Promise<Product[]> {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data) as Product[];
    } catch (error) {
        console.error('Error reading products file:', error);
        throw new Error('Could not read products data');
    }
}


export async function getAllProducts(query: ProductsQuery = {}) {
    const { search, category, inStock, sortBy, order, page=1, limit=6 } = query;
    let products = await readProductsFile();

    products = searchProducts(products, search);
    products = filterByCategory(products, category);
    products = filterByStock(products, inStock);
    products = sortProducts(products, sortBy, order);

    const currentPage = Number(page);
    const pageSize = Number(limit);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
        data: paginatedProducts,
        pagination: {
            page: currentPage,
            limit: pageSize,
            totalItems,
            totalPages
        }
    };
}

export async function getProductDetail(id: number): Promise<ProductDetail | null> {
    const products = await readProductsFile();
    const product = products.find(p => p.id === id);

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
    const products = await readProductsFile();
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 5).length;
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const averagePrice = totalProducts > 0 ? (totalPrice / totalProducts).toFixed(2) : 0;

    return {
        totalProducts,
        lowStockProducts,
        totalPrice,
        averagePrice
    };
}