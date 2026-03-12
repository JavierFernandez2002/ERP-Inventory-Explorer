function searchProducts(products, search) {
    if (!search) return products;

    const lowerSearch = search.toLowerCase();

    //console.log(products);
    //console.log(search);

    return products.filter(product =>
        (product.name || "").toLowerCase().includes(lowerSearch) ||
        (product.description || "").toLowerCase().includes(lowerSearch)
    );
}

function filterByCategory(products, category) {
    if (!category) return products;

    return products.filter(
        (product) => (product.category || "").toLowerCase() === (category || "").toLowerCase());
}

function filterByStock(products, inStock) {
    if (inStock !== "true") return products;

    return products.filter((product) => product.stock > 0);
}

function sortProducts(products, sortBy = 'name', order = 'asc') {
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

module.exports = {
    searchProducts,
    filterByCategory,
    filterByStock,
    sortProducts,
};