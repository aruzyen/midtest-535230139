const joi = require('joi');

module.exports = {
  addProductToCart: {
    body: {
      quantity: joi.number().required().label('Item quantity'),
    },
  },

  updateProductInCart: {
    body: {
      quantity: joi.number().required().label('Item quantity'),
    },
  },
};
