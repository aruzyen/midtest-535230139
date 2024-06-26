const productsService = require('./products-service');
const {
  errorResponder,
  errorTypes,
  errorHandler,
} = require('../../../core/errors');

/**
 * Get list of products
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    const number = parseInt(request.query.page_number) || null;
    const size = parseInt(request.query.page_size) || null;
    const sort = request.query.sort;
    const search = request.query.search;

    const products = await productsService.getProducts(
      number,
      size,
      sort,
      search
    );
    return response.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get product detail
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProducts(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Create new product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function insertProduct(request, response, next) {
  try {
    const name = request.body.name;
    const category = request.body.category;
    const price = request.body.price;
    const stock = request.body.stock;

    const success = await productsService.insertProduct(
      name,
      category,
      price,
      stock
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ name, category, price, stock });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update existing product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const productId = request.params.id;
    const name = request.body.name;
    const category = request.body.category;
    const price = request.body.price;
    const stock = request.body.stock;

    const success = await productsService.updateProduct(
      productId,
      name,
      category,
      price,
      stock
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product detail'
      );
    }

    return response
      .status(200)
      .json({ productId, name, category, price, stock });
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete product from the list
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const productId = request.params.id;

    const success = await productsService.deleteProduct(productId);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ productId });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
};
