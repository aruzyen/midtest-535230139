const { Cart } = require('../../../models');
const productsRepository = require('../products/products-repository');

/**
 * Get a list of products in user's shopping cart
 * @returns {Promise}
 */
async function getCartsProducts() {
  return Cart.find({});
}

/**
 * Get product detail in user's shopping cart
 * @params {string} productId - Product ID
 * @returns {Promise}
 */
async function getCartProduct(productId) {
  return Cart.findById(productId);
}

/**
 * Adds a product to user's shopping cart
 * @param {string} productId
 * @param {Number} quantity
 * @returns {Promise}
 */
async function addProductToCart(productId, quantity) {
  const product = await productsRepository.getProduct(productId);
  const name = product.name;
  const category = product.category;
  const price = product.price;
  return Cart.create({
    productId,
    name,
    category,
    price,
    quantity,
  });
}

/**
 * Update the quantity from product in user's shopping cart
 * @param {string} productId
 * @param {Number} quantity
 * @returns {Promise}
 */
async function updateProductInCart(productId, quantity) {
  return Cart.updateOne({ _id: productId }, { $set: { quantity } });
}

/**
 * Remove product from user's shopping cart
 * @param {string} productId
 * @returns {Promise}
 */
async function removeProductFromCart(productId) {
  return Cart.deleteOne({ _id: productId });
}

module.exports = {
  getCartsProducts,
  getCartProduct,
  updateProductInCart,
  addProductToCart,
  removeProductFromCart,
};
