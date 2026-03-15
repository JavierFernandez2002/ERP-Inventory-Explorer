const productsContainer = document.getElementById('productsContainer');
const productDetail = document.getElementById('productDetailsContainer');

const paginationControls = document.getElementById('paginationControls');
let currentPage = 1;
let pageSize = 6;

const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const inStockCheckbox = document.getElementById('inStockCheckbox');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const statsSection = document.getElementById('statsSection');

async function fetchProducts(page = 1) {
  currentPage = page;
  productsContainer.innerHTML = `<div class="loading-state">Loading products...</div>`;
  
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

  params.append('page', currentPage);
  params.append('limit', pageSize);

  try {
    const response = await fetch(`/api/products?${params.toString()}`);
    const products = await response.json();
    renderProducts(products.data);
    renderPagination(products.pagination);
  } catch (error) {
    console.error('Error fetching products:', error);
    productsContainer.innerHTML = `
      <div class="no-products">Failed to load products.</div>
    `;
  }
}

function renderProducts(products) {
  productsContainer.innerHTML = products
    .map((product) => {
      let stockClass = "stock-ok";
      let stockLabel = `Available · ${product.stock} units`;

      if (product.stock === 0) {
        stockClass = "stock-out";
        stockLabel = "Out of stock";
      } else if (product.stock <= 5) {
        stockClass = "stock-low";
        stockLabel = `Low stock · ${product.stock} units`;
      }
      return `
                <div class="product-card">
                    <h3>${product.name}</h3>

                <div class="product-meta">
                    <span><strong>Category:</strong> ${product.category}</span>
                    <span><strong>Supplier:</strong> ${product.supplier}</span>
                </div>

                <div class="product-price">$${product.price}</div>

                <span class="stock-badge ${stockClass}">
                    ${stockLabel}
                </span>

                <button onclick="fetchProductDetail(${product.id})">View detail</button>
                </div>
            `;
    })
    .join("");
}

function renderPagination(pagination) {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) {
    paginationControls.innerHTML = '';
    return;
  }

  paginationControls.innerHTML = `
    <button ${page === 1 ? 'disabled' : ''} onclick="fetchProducts(${page - 1})">Previous</button>
    <span>Page ${page} of ${totalPages}</span>
    <button ${page === totalPages ? 'disabled' : ''} onclick="fetchProducts(${page + 1})">Next</button>
  `;
}

async function fetchProductDetail(id) {
  productDetail.innerHTML = `
    <div class="detail-placeholder">Loading product detail...</div>
  `;
  try {
    const response = await fetch(`/api/products/${id}`);
    const product = await response.json();

    renderProductDetail(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);

    productDetail.innerHTML = `
      <div class="detail-placeholder">Failed to load product detail.</div>
    `;
  }
}

function renderProductDetail(product) {
  let stockClass = "stock-ok";
  let stockLabel = `Available · ${product.stock} units`;

  if (product.stock === 0) {
    stockClass = "stock-out";
    stockLabel = "Out of stock";
  } else if (product.stock <= 5) {
    stockClass = "stock-low";
    stockLabel = `Low stock · ${product.stock} units`;
  }

  productDetail.innerHTML = `
    <div class="detail-card">
      <h3>${product.name}</h3>

      <span class="stock-badge ${stockClass}">
        ${stockLabel}
      </span>

      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Category</span>
          <span class="detail-value">${product.category}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Price</span>
          <span class="detail-value">$${product.price}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Stock</span>
          <span class="detail-value">${product.stock} units</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Supplier</span>
          <span class="detail-value">${product.supplier}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Country</span>
          <span class="detail-value">${product.country.name}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Region</span>
          <span class="detail-value">${product.country.region}</span>
        </div>
      </div>

      ${
        product.country.flag
          ? `
            <div class="flag-wrapper">
              <img src="${product.country.flag}" alt="Flag of ${product.country.name}" />
              <div>
                <span class="detail-label">Supplier Country Flag</span>
                <span class="detail-value">${product.country.name}</span>
              </div>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function clearFilters() {
  searchInput.value = '';
  categorySelect.value = '';
  sortSelect.value = '';
  inStockCheckbox.checked = false;
  fetchProducts(1);
}

async function fetchStats() {
  statsSection.innerHTML = `
    <div class="stats-card"><span class="stats-label">Total Products</span><span class="stats-value">...</span></div>
    <div class="stats-card"><span class="stats-label">Low Stock</span><span class="stats-value">...</span></div>
    <div class="stats-card"><span class="stats-label">Average Price</span><span class="stats-value">...</span></div>
  `;
  try {
    const response = await fetch('/api/stats');
    const stats = await response.json();

    renderStats(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);

    statsSection.innerHTML = `
      <div class="stats-card error-card">
        <span class="stats-label">Stats</span>
        <span class="stats-value error-text">Failed to load</span>
      </div>
    `;
  }
}

function renderStats(stats) {
  statsSection.innerHTML = `
        <div class="stats-card">
            <span class="stats-label">Total Products</span>
            <span class="stats-value">${stats.totalProducts}</span>
        </div>
        <div class="stats-card">
            <span class="stats-label">Low Stock</span>
            <span class="stats-value">${stats.lowStockCount}</span>
        </div>
        <div class="stats-card">
            <span class="stats-label">Average Price</span>
            <span class="stats-value">$${stats.averagePrice}</span>
        </div>
    `;
}


applyFiltersBtn.addEventListener('click', () => fetchProducts(1));
clearFiltersBtn.addEventListener('click', clearFilters);

// Initial fetchs
fetchStats();
fetchProducts(1);