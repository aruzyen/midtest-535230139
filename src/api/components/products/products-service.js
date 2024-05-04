const productsRepository = require('./products-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Get list of products
 * @param {Number} number - Number of current page out of all the pages available
 * @param {Number} size - Size of current page
 * @param {Object} sort - Sort data of products by category/price/name/stock (ascending by default)
 * @param {Object} search - Search data of products by category/price/name/stock
 * @returns {Array}
 */
async function getProducts(number, size, sort, search) {
  const products = await productsRepository.getProducts();
  const results = [];

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  }
  return results;
}

/**
 * Get product detail
 * @param {string} productId - Product ID
 * @returns {Object}
 */
async function getProduct(productId) {
  const product = await productsRepository.getproduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
  };
}

/**
 * Create new product
 * @param {string} name - Product Name
 * @param {string} category - Product Category
 * @param {Number} price - Product's Price
 * @param {Number} stock - Stock Available
 * @returns {boolean}
 */
async function insertProduct(name, category, price, stock) {
  try {
    await productsRepository.insertProduct(name, category, price, stock);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing product
 * @param {string} productId - Product ID
 * @param {Number} price - New Product Price
 * @param {Number} stock - New Product Stock
 * @returns {boolean}
 */
async function updateProduct(productId, price, stock) {
  const product = await productsRepository.getProduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.updateProduct(productId, price, stock);
  } catch (error) {
    return null;
  }

  return true;
}

// /**
//  * Update existing product price
//  * @param {string} productId - Product ID
//  * @param {Number} stock - New Product Stock
//  * @returns {boolean}
//  */
// async function updateProductPrice(productId) {
//   const product = await productsRepository.getProduct(productId);

//   // Product not found
//   if (!product) {
//     return null;
//   }

//   try {
//     await productsRepository.updateProductPrice(id, price);
//   } catch (err) {
//     return null;
//   }

//   return true;
// }

// /**
//  * Update existing product stock
//  * @param {string} productId - Product ID
//  * @param {Number} stock - New Product Stock
//  * @returns {boolean}
//  */
// async function updateProductStock(productId) {
//   const product = await productsRepository.getProduct(productId);

//   // Product not found
//   if (!product) {
//     return null;
//   }

//   try {
//     await productsRepository.updateProductStock(id, stock);
//   } catch (err) {
//     return null;
//   }

//   return true;
// }

/**
 * Delete product from the list
 * @param {string} productId - Product ID
 * @returns {boolean}
 */
async function deleteProduct(productId) {
  const product = await productsRepository.getProduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.deleteProduct(productId);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
};
