const productsRepository = require('./products-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getProducts() {
  const products = await productsRepository.getProducts();
  const results = [];

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      email: product.email, // jangan lupa diganti
      password: product.password, // jangan lupa diganti
    });
  }
  return results;
}

async function getProduct(productId) {
  const product = await productsRepository.getproduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    email: product.email, // jangan lupa diganti
  };
}

async function inputProduct(name, catgory, price, stock) {
  // GANTIIII
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await productsRepository.inputProduct(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateProduct(productId) {
  const product = await productsRepository.getProduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  // Mungkin coba nanti diganti update stock atau harga aja
  try {
    await productsRepository.updateProduct(id, name, category);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteProduct(productId) {
  const product = await productsRepository.getProduct(productId);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.deleteProduct(productId);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateProduct,
  deleteProduct,
};
