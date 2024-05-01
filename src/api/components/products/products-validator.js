const joi = require('joi');

module.exports = {
  insertProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      category: joi.string().email().required().label('Category'),
      price: joi.number().required().label('Price'),
      stock: joi.number().label('Stock available'),
      forSale: joi.boolean().label('For Sale'),
    },
  },

  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      category: joi.string().email().required().label('Category'),
      price: joi.number().label('Price'),
      stock: joi.number().label('Stock available'),
      forSale: joi.boolean().label('For Sale'),
    },
  },
};
