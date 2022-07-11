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

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const productUpdate = await ProductService.updateProduct(id, name);

  if (productUpdate.message) {
    return res.status(productUpdate.code).json({ message: productUpdate.message });
  }

  res.status(200).json(productUpdate);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const productDelete = await ProductService.deleteProduct(id);

  if (productDelete.message) {
    return res.status(productDelete.code).json({ message: productDelete.message });
  }

  res.status(204).end();
};

const query = async (req, res) => {
  const { q } = req.query;
  
  const products = await ProductService.query(q);

  res.status(200).json(products);
};

module.exports = {
  getAll,
  findById,
  create,
  updateProduct,
  deleteProduct,
  query,
};