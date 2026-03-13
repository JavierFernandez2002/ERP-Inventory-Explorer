const test = require('node:test');
const assert = require('node:assert/strict');
const { searchProducts,
  filterByCategory,
  filterByStock,
  sortProducts } = require('../src/utils/products.utils.js');

const sampleProducts = [
  {
    id: 1,
    name: "Notebook Lenovo IdeaPad 5",
    category: "Laptops",
    price: 1200,
    stock: 8
  },
  {
    id: 2,
    name: "Logitech MX Master 3S",
    category: "Accessories",
    price: 120,
    stock: 3
  },
  {
    id: 3,
    name: "Kingston SSD 1TB",
    category: "Storage",
    price: 95,
    stock: 0
  }
];

test("searchProducts return all products when no search term is provided", () => {
  const result = searchProducts(sampleProducts, "");
  assert.equal(result.length, 3);
});

test("searchProducts filters products by name", () => {
  const result = searchProducts(sampleProducts, "Logitech");
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "Logitech MX Master 3S");
});

test("filterByCategory returns products of the specified category", () => {
  const result = filterByCategory(sampleProducts, "Laptops");
  assert.equal(result.length, 1);
  assert.equal(result[0].category, "Laptops");
});

test("filterByStock returns all products when inStock is not true", () => {
    const result = filterByStock(sampleProducts, "false");
    assert.equal(result.length, 3);
});

test("filterByStock returns only products with stock > 0 when inStock is true", () => {
    const result = filterByStock(sampleProducts, "true");
    assert.equal(result.length, 2);
    assert.ok(result.every(p => p.stock > 0));
});

test("sortProducts sorts products by price in ascending order", () => {
    const result = sortProducts(sampleProducts, "price", "asc");
    assert.equal(result[0].price, 95);
    assert.equal(result[1].price, 120);
    assert.equal(result[2].price, 1200);
});

test("sortProducts sorts products by price in descending order", () => {
    const result = sortProducts(sampleProducts, "price", "desc");
    assert.equal(result[0].price, 1200);
    assert.equal(result[1].price, 120);
    assert.equal(result[2].price, 95);
});

test("sortProducts sorts by name ascending by default", () => {
    const result = sortProducts(sampleProducts);
    assert.equal(result[0].name, "Kingston SSD 1TB");
    assert.equal(result[1].name, "Logitech MX Master 3S");
    assert.equal(result[2].name, "Notebook Lenovo IdeaPad 5");
});
