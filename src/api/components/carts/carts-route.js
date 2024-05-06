const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const cartsController = require('./carts-controller');
const cartsValidator = require('./carts-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/carts/', route);

  // Get list of products in the cart
  route.get('/', authenticationMiddleware, cartsController.getCartsProducts);

  // Get product detail
  route.get('/:id', cartsController.getCartProduct);

  // Insert product to the cart
  route.post(
    '/:id',
    authenticationMiddleware,
    celebrate(cartsValidator.addProductToCart),
    cartsController.addProductToCart
  );

  // Update the product in the cart
  route.put(
    '/:id',
    celebrate(cartsValidator.updateProductInCart),
    cartsController.updateProductInCart
  );

  // Delete product from the cart
  route.delete('/:id', cartsController.removeProductFromCart);
};
