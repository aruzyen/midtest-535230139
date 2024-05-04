const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsController = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  // Get list of products
  route.get('/', authenticationMiddleware, productsController.getProducts);

  // Input product to the list
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.inputProduct),
    productsControllers.inputProduct
  );

  // Get product detail
  route.get('/:id', authenticationMiddleware, productsController.getProduct);

  // Update the product information
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsController.updateProduct),
    productsController.updateProduct
  );

  // Delete product from the list
  route.delete(
    '/:id',
    authenticationMiddleware,
    productsControllers.deleteProduct
  );
};
