const test = require("node:test");
const assert = require("node:assert/strict");
const {
  searchProducts,
  filterByCategory,
  filterByStock,
  sortProducts
} = require("../src/utils/products.utils.js");

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

test("searchProducts should return all products when no search term is provided", () => {
  const result = searchProducts(sampleProducts, "");

  assert.equal(
    result.length,
    3,
    `Expected 3 products when no search term is provided, but got ${result.length}`
  );
});

test("searchProducts should filter products by name", () => {
  const searchTerm = "Logitech";
  const result = searchProducts(sampleProducts, searchTerm);

  assert.equal(
    result.length,
    1,
    `Expected 1 product when searching '${searchTerm}', but got ${result.length}`
  );

  assert.equal(
    result[0]?.name,
    "Logitech MX Master 3S",
    `Expected product name to be 'Logitech MX Master 3S', but got '${result[0]?.name}'`
  );
});

test("filterByCategory should return only products from the specified category", () => {
  const category = "laptops";
  const result = filterByCategory(sampleProducts, category);

  assert.equal(
    result.length,
    1,
    `Expected 1 product for category '${category}', but got ${result.length}`
  );

  assert.equal(
    result[0]?.category,
    "Laptops",
    `Expected returned product category to be 'Laptops', but got '${result[0]?.category}'`
  );

  assert.equal(
    result[0]?.name,
    "Notebook Lenovo IdeaPad 5",
    `Expected product name to be 'Notebook Lenovo IdeaPad 5', but got '${result[0]?.name}'`
  );
});

test("filterByStock should return all products when inStock is not true", () => {
  const result = filterByStock(sampleProducts, "false");

  assert.equal(
    result.length,
    3,
    `Expected 3 products when inStock is not 'true', but got ${result.length}`
  );
});

test("filterByStock should return only products with stock greater than 0 when inStock is true", () => {
  const result = filterByStock(sampleProducts, "true");

  assert.equal(
    result.length,
    2,
    `Expected 2 products with stock greater than 0, but got ${result.length}`
  );

  assert.ok(
    result.every((product) => product.stock > 0),
    "Expected all returned products to have stock greater than 0"
  );
});

test("sortProducts should sort products by price in ascending order", () => {
  const result = sortProducts(sampleProducts, "price", "asc");

  assert.deepEqual(
    result.map((product) => product.price),
    [95, 120, 1200],
    "Expected products to be sorted by price in ascending order"
  );
});

test("sortProducts should sort products by price in descending order", () => {
  const result = sortProducts(sampleProducts, "price", "desc");

  assert.deepEqual(
    result.map((product) => product.price),
    [1200, 120, 95],
    "Expected products to be sorted by price in descending order"
  );
});

test("sortProducts should sort products by name in ascending order by default", () => {
  const result = sortProducts(sampleProducts);

  assert.deepEqual(
    result.map((product) => product.name),
    [
      "Kingston SSD 1TB",
      "Logitech MX Master 3S",
      "Notebook Lenovo IdeaPad 5"
    ],
    "Expected products to be sorted by name in ascending order by default"
  );
});