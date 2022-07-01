const ProductService = require('../services/productsService');

const getAll = async (_req, res) => {
  const products = await ProductService.getAll();

  res.status(200).json(products);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const product = await ProductService.findById(id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  res.status(200).json(product);
};

const create = async (req, res) => {
  const { name } = req.body;
  const product = await ProductService.create(name);

  if (product.message) return res.status(product.code).json({ message: product.message });
  
  res.status(201).json(product);
};

module.exports = {
  getAll,
  findById,
  create,
};