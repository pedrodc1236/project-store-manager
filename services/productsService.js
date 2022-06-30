const Product = require('../models/productsModel');

const getAll = async () => {
  const products = await Product.getAll();
  
  return products;
};

const findById = async (id) => {
  const product = await Product.findById(id);

  if (!product) return null;

  return product;
};

module.exports = {
  getAll,
  findById,
};