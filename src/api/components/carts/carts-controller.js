const cartsService = require('./carts-service');
const {
  errorResponder,
  errorTypes,
  errorHandler,
} = require('../../../core/errors');

/**
 * Get a list of products in user's shopping cart
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getCartsProducts(request, response, next) {
  try {
    const email = request.query.email;
    const number = parseInt(request.query.page_number) || null;
    const size = parseInt(request.query.page_size) || null;
    const sort = request.query.sort;
    const search = request.query.search;

    const productsInCart = await cartsService.getCartsProducts(
      email,
      number,
      size,
      sort,
      search
    );
    return response.status(200).json(productsInCart);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get product detail in user's shopping cart
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getCartProduct(request, response, next) {
  try {
    const product = await cartsService.getCartProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Adds a product to user's shopping cart
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function addProductToCart(request, response, next) {
  try {
    const productId = request.params.id;
    const quantity = request.body.quantity;

    const success = await cartsService.addProductToCart(productId, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to add product to the cart'
      );
    }

    return response.status(200).json({ productId, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update the quantity from product in user's shopping cart
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProductInCart(request, response, next) {
  try {
    const productId = request.params.id;
    const quantity = request.body.quantity;

    const success = await cartsService.updateProductInCart(productId, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product detail'
      );
    }

    return response.status(200).json({ productId, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Remove product from user's shopping cart
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function removeProductFromCart(request, response, next) {
  try {
    const productId = request.params.id;

    const success = await cartsService.removeProductFromCart(productId);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product from cart'
      );
    }

    return response.status(200).json({ productId });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCartsProducts,
  getCartProduct,
  addProductToCart,
  updateProductInCart,
  removeProductFromCart,
};
