import { Product } from '../types/product';

export function searchProducts(products: Product[], search?: string): Product[] {
    if (!search) return products;

    const lowerSearch = search.toLowerCase();

    //console.log(products);
    //console.log(search);

    return products.filter(product =>
        (product.name || "").toLowerCase().includes(lowerSearch) ||
        (product.description || "").toLowerCase().includes(lowerSearch)
    );
}

export function filterByCategory(products: Product[], category?: string): Product[] {
    if (!category) return products;

    return products.filter(
        (product) => (product.category || "").toLowerCase() === (category || "").toLowerCase());
}

export function filterByStock(products: Product[], inStock?: string): Product[] {
    if (inStock !== "true") return products;

    return products.filter((product) => product.stock > 0);
}

export function sortProducts(
    products: Product[], 
    sortBy = 'name', 
    order = 'asc'): Product[] {
    const sorted = [...products].sort((a, b) => {
        if (sortBy === 'price') {
            return a.price - b.price;
        }
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    return order === 'desc' ? sorted.reverse() : sorted;
}

export default {
    searchProducts,
    filterByCategory,
    filterByStock,
    sortProducts,
};