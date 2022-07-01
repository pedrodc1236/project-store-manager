const ProductModel = require('../models/productsModel');

const getAll = async () => {
  const products = await ProductModel.getAll();
  
  return products;
};

const findById = async (id) => {
  const product = await ProductModel.findById(id);

  if (!product) return null;

  return product;
};

module.exports = {
  getAll,
  findById,
};