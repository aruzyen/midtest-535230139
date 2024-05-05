const { Product } = require('../../../models');
const productsRoute = require('./products-route');
const mongoose = require('mongoose');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail
 * @param {string} productId - Product ID
 * @returns {Promise}
 */
async function getProduct(productId) {
  return Product.findById(productId);
}

/**
 * Insert new product
 * @param {string} name - Product Name
 * @param {string} category - Product Category
 * @param {string} price - Price of product (in IDR)
 * @param {string} stock - Product's stock available
 * @returns {Promise}
 */
async function insertProduct(name, category, price, stock) {
  return Product.create({
    name,
    category,
    price,
    stock,
  });
}

/**
 * Update existing product information
 * @param {string} productId - Product ID
 * @param {Number} price - New price of product (in IDR)
 * @param {Number} stock - New stock of stock
 * @returns {Promise}
 */
async function updateProduct(productId, price, stock) {
  return Product.updateOne({ _id: productId }, { $set: { price, stock } });
}
// /**
//  * Update existing product's price
//  * @param {string} productId - Product ID
//  * @param {string} price - New price of product (in IDR)
//  * @returns {Promise}
//  */
// async function updateProductPrice(productId, price) {
//   return Product.updateOne(
//     {
//       _id: productId,
//     },
//     {
//       $set: {
//         price,
//       },
//     }
//   );
// }

// /**
//  * Update existing product's stock
//  * @param {string} productId - Product ID
//  * @param {string} stock - New stock of product
//  * @returns {Promise}
//  */
// async function updateProductStock(productId, stock) {
//   return Product.updateOne(
//     {
//       _id: productId,
//     },
//     {
//       $set: {
//         stock,
//       },
//     }
//   );
// }

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Promise}
 */
async function deleteProduct(productId) {
  return Product.deleteOne({ _id: productId });
}

/**
 * Sort the list of products
 * @param {Object} products - The list of products
 * @param {String} field - Field to be sorted
 * @param {String} order - Order of sort (asc or desc)
 */
function sortProducts(products, sort) {
  const [field, order] = sort.split(':'); // Split the parameters
  return products.sort((a, b) => {
    if (order == 'asc') {
      return a[field] > b[field] ? 1 : -1;
    } else if (order == 'desc') {
      return a[field] < b[field] ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Search something from the list of products
 * @param {Object} products - The list of products
 * @param {String} field - Field to be searched
 * @param {String} key   - What to search in the field
 */
function searchProducts(products, search) {
  const [field, key] = search.split(':'); // Split the parameters
  return products.filter((product) =>
    product[field].toLowerCase().includes(key.toLowerCase())
  );
}

module.exports = {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  sortProducts,
  searchProducts,
};
