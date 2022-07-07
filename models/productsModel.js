const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT * FROM StoreManager.products ORDER BY id;';
  const [products] = await connection.execute(query);
  return products;
};

const findById = async (id) => {
  const query = 'SELECT * FROM StoreManager.products WHERE id = ?;';
  const [product] = await connection.execute(query, [id]);

  if (product.length === 0) return null;

  return product[0];
};

const create = async (name) => {
  const query = 'INSERT INTO StoreManager.products (name) VALUES (?)';
  const [product] = await connection.execute(query, [name]);

  return {
    id: product.insertId,
    name,
  };
};

const updateProduct = async (id, name) => {
  const queryUpdateProduct = `UPDATE StoreManager.products
    SET name = ?
    WHERE id = ?;`;
  await connection.execute(queryUpdateProduct, [name, id]);

  return { id, name };
};

module.exports = {
  getAll,
  findById,
  create,
  updateProduct,
};