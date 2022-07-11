const connection = require('./connection');

const saleModel = {
  createSale: async () => {
    const querySale = 'INSERT INTO StoreManager.sales (date) VALUES (NOW());';
    const [result] = await connection.execute(querySale);
    return result.insertId;
  },
  createSaleProduct: async ({ saleId, productId, quantity }) => {
    await connection.execute(
      'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES(?, ?, ?);',
      [saleId, productId, quantity],
    ); 
    return { productId, quantity };
  },
  getAll: async () => {
    const queryGetAll = 'SELECT * FROM StoreManager.products;';
    const [result] = await connection.execute(queryGetAll);
    return result;
  },
  getAllList: async () => {
    const queryGetAllList = `SELECT sp.sale_id, s.date, sp.product_id, sp.quantity 
      FROM StoreManager.sales_products AS sp
      INNER JOIN StoreManager.sales AS s
      ON sp.sale_id = s.id
      ORDER BY sp.sale_id, sp.product_id;`;
    const [result] = await connection.execute(queryGetAllList);
    return result;
  },
  findById: async (id) => {
    const queryFindById = `SELECT s.date, sp.product_id, sp.quantity 
      FROM StoreManager.sales_products AS sp
      INNER JOIN StoreManager.sales AS s
      ON sp.sale_id = s.id
      WHERE s.id = ?
      ORDER BY sp.sale_id, sp.product_id;`;
    const [result] = await connection.execute(queryFindById, [id]);
    return result;
  },
  updateSale: async (id, quantity, productId) => {
    const queryUpdateSale = `UPDATE StoreManager.sales_products
      SET quantity = ?
      WHERE sale_id = ?
      AND product_id = ?;`;
    await connection.execute(queryUpdateSale, [quantity, id, productId]);
    return { productId, quantity };
  },
};

module.exports = saleModel;