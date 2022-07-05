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
};

module.exports = saleModel;