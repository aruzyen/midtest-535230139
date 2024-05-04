const productsService = require('./products-service');
const {
  errorResponder,
  errorTypes,
  errorHandler,
} = require('../../../core/errors');

async function getProducts(request, response, next) {
  // HARUSNYA DONE

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

async function getProduct(request, response, next) {
  // HARUSNYA DONE

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

async function insertProduct(request, response, next) {
  // HARUSNYA DONE
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

async function updateProduct(request, response, next) {
  try {
    const productId = request.params.id;
    const price = request.params.price;
    const stock = request.params.stock;

    const success = await productsService.updateProduct(
      productId,
      price,
      stock
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product detail'
      );
    }

    return response.status(200).json({ id, price, stock });
  } catch (error) {
    return next(error);
  }
}

// async function updateProductPrice(request, response, next) {
//   // HARUSNYA DONE
//   try {
//     const productId = request.params.id;
//     const price = request.params.price;

//     const success = await productsService.updateProductPrice(productId, price);
//     if (!success) {
//       throw errorResponder(
//         errorTypes.UNPROCESSABLE_ENTITY,
//         'Failed to update product price'
//       );
//     }

//     return response.status(200).json({ id, price });
//   } catch (error) {
//     return next(error);
//   }
// }

// async function updateProductStock(request, repsonse, next) {
//   try {
//     const productId = request.params.id;
//     const stock = request.params.stock;

//     const success = await productsService.updateProductStock(productId, stock);
//     if (!success) {
//       throw errorResponder(
//         errorTypes.UNPROCESSABLE_ENTITY,
//         'Failed to update product stock'
//       );
//     }
//     return response.status(200).json({ id, stock });
//   } catch (error) {
//     return next(error);
//   }
// }

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
