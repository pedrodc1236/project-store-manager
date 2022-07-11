const ProductModel = require('../models/productsModel');

const isValid = (name) => {
  if (!name) return { code: 400, message: '"name" is required' };
  if (name.length < 5) {
    return {
      code: 422,
      message: '"name" length must be at least 5 characters long',
    }; 
  }

  return true;
};

const getAll = async () => {
  const products = await ProductModel.getAll();
  
  return products;
};

const findById = async (id) => {
  const product = await ProductModel.findById(id);

  if (!product) return null;

  console.log(product);
  return product;
};

const create = async (name) => {
  const isProductValid = isValid(name);

  if (isProductValid.message) return isProductValid;

  const product = await ProductModel.create(name);

  return product;
};

const updateProduct = async (id, name) => {
  const isProductValid = isValid(name);

  if (isProductValid.message) return isProductValid;

  const existsId = await ProductModel.findById(id);

  if (!existsId) return { code: 404, message: 'Product not found' };

  const productUpdate = await ProductModel.updateProduct(id, name);

  return productUpdate;
};

const deleteProduct = async (id) => {
  const existsId = await ProductModel.findById(id);

  if (!existsId) return { code: 404, message: 'Product not found' };

  const productDelete = await ProductModel.deleteProduct(id);
  
  console.log(productDelete);
  return productDelete;
};

const query = async (q) => {
  const products = await ProductModel.query(q);
  return products;
};

module.exports = {
  getAll,
  findById,
  create,
  updateProduct,
  deleteProduct,
  query,
};