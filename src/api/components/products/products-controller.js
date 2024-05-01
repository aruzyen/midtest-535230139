const productsService = require('./products-service');
const {
  errorResponder,
  errorTypes,
  errorHandler,
} = require('../../../core/errors');

async function getProducts() {}

async function getProduct(productId) {}

async function inputProduct() {}

async function updateProduct(productId) {}

async function deleteProduct() {}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateProduct,
  deleteProduct,
};
