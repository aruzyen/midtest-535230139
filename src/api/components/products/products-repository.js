const { Product } = require('../../../models');
const productsRoute = require('./products-route');

async function getProducts() {
  return Product.find({});
}

async function getProduct(productId) {
  return Product.findById(productId);
}

async function inputProduct(name, category, price, stock) {
  return Product.input({
    name,
    category,
    price,
    stock,
  });
}

async function updateProductPrice(productId, name, price) {
  return Product.updateOne(
    {
      _id: productId,
    },
    {
      $set: {
        name,
        price,
      },
    }
  );
}

async function updateProductStock(productId, name, price) {
  return Product.updateOne(
    {
      _id: productId,
    },
    {
      $set: {
        name,
        stock,
      },
    }
  );
}

async function deleteProduct(productId) {
  return Product.deleteOne({ _id: productId });
}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateProductPrice,
  updateProductStock,
  deleteProduct,
};
