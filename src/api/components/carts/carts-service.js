const productsRepository = require('../products/products-repository');
const cartsRepository = require('./carts-repository');
const usersRepository = require('../users/users-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { ceil } = require('lodash');

/**
 * Get list of products in user's shopping cart
 * @param {Number} number - Number of current page out of all the pages available
 * @param {Number} size - Size of current page
 * @param {Object} sort - Sort data of products by category/price/name/stock (ascending by default)
 * @param {Object} search - Search data of products by category/price/name/stock
 * @returns {Object}
 */
async function getCartsProducts(email, number, size, sort, search) {
  const user = await usersRepository.getUserByEmail(email);
  let productsInCart = await cartsRepository.getCartsProducts();
  const results = [];

  // Using ternary operators to search and sort function
  // (if search and/or sort are queried)
  search &&
    (productsInCart = productsRepository.searchProducts(
      productsInCart,
      search
    ));
  sort &&
    (productsInCart = productsRepository.sortProducts(productsInCart, sort));

  if (!number && !size) {
    for (let i = 0; i < productsInCart.length; i += 1) {
      const product = productsInCart[i];
      results.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
      });
    }
    return {
      title: `${user.name}'s Shopping Cart`,
      data: results,
    };
  }

  // Throw error when one of the page_size or page_number is not queried
  else if ((number && !size) || (!number && size)) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      `One of the: page size or page number are not initialized`
    );
  }

  // If the page_number and page_size are queried
  else {
    const limit = ceil(productsInCart.length / size);
    if (number > limit) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        `Exceeded the page limit`
      );
    }

    // A function to return boolean value if the current page have a previous page
    function hasPrevPage(number, limit) {
      return number > 1 && limit > 1;
    }

    // A function to return boolean value if the current page have a next page
    function hasNextPage(number, limit) {
      return true ? number < limit : number < limit + 1;
    }

    const shift = (number - 1) * size;
    for (let i = shift; i < size + shift; i += 1) {
      const product = productsInCart[i];

      // Get out of the operation when the variable i exceeds the products length (null or NaN)
      if (productsInCart[i] == null || productsInCart[i] == NaN) {
        break;
      }

      // Push the products schema into the results[] array
      results.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
      });
    }

    return {
      title: `${user.name}'s Shopping Cart`,
      page_number: number,
      page_size: size,
      items_in_cart: productsInCart.length,
      total_pages: limit,
      has_previous_page: hasPrevPage(number, limit),
      has_next_page: hasNextPage(number, limit),
      data: results,
    };
  }
}

/**
 * Get product detail in user's shopping cart
 * @param {string} productId
 * @returns {Object}
 */
async function getCartProduct(productId) {
  const product = await cartsRepository.getCartProduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
  };
}

/**
 * Adds a product to user's shopping cart
 * @param {string} productId
 * @param {Number} quantity
 * @returns {boolean}
 */
async function addProductToCart(productId, quantity) {
  const product = await productsRepository.getProduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await cartsRepository.addProductToCart(productId, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update the quantity from product in user's shopping cart
 * @param {string} productId
 * @param {Number} quantity
 * @returns {boolean}
 */
async function updateProductInCart(productId, quantity) {
  const product = await cartsRepository.getCartProduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await cartsRepository.updateProductInCart(productId, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Remove product from user's shopping cart
 * @param {string} productId
 * @returns
 */
async function removeProductFromCart(productId) {
  const product = await cartsRepository.getCartProduct(productId);

  if (!product) {
    return null;
  }

  try {
    await cartsRepository.removeProductFromCart(productId);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getCartsProducts,
  getCartProduct,
  addProductToCart,
  updateProductInCart,
  removeProductFromCart,
};
