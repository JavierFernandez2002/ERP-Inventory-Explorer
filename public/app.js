const productsContainer = document.getElementById('productsContainer');
const productDetail = document.getElementById('productDetail');

const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const inStockCheckbox = document.getElementById('inStockCheckbox');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

async function fetchProducts() {
    const search = searchInput.value.trim();
    const category = categorySelect.value;
    const inStock = inStockCheckbox.checked;
    const [sortBy, order] = sortSelect.value.split('-');

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (inStock) params.append('inStock', 'true');
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);

    try {
        const response = await fetch(`/api/products?${params.toString()}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts(products) {
    productsContainer.innerHTML = products
        .map(product => `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="fetchProductDetail(${product.id})">View Details</button>
            </div>
        `)
        .join('');
}

async function fetchProductDetail(id) {
    try {
        const response = await fetch(`/api/products/${id}`);
        const product = await response.json();
        
        productDetail.innerHTML = `
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>Stock: ${product.stock}</p>
            <p>Supplier: ${product.supplier}</p>
            <p>Country: ${product.country.name}</p>
            <p>Region: ${product.country.region}</p>
            ${product.country.flag ? `<img src="${product.country.flag}" alt="flag" width="80"/>` : ''}
        `;
    } catch (error) {
        console.error('Error fetching product detail:', error);
    }
}

function clearFilters() {
    searchInput.value = '';
    categorySelect.value = '';
    sortSelect.value = '';
    inStockCheckbox.checked = false;
    fetchProducts();
}

applyFiltersBtn.addEventListener('click', fetchProducts);
clearFiltersBtn.addEventListener('click', clearFilters);

// Initial fetch of products
fetchProducts();