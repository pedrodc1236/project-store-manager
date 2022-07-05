const saleService = require('../services/salesService');

const saleController = {
  createSaleProduct: async (req, res) => {
    const { body } = req;
    const saleProduct = await saleService.createSale(body);
    
    if (saleProduct.code) {
      const { code, message } = saleProduct;
      return res.status(code).json({ message });
    }

    res.status(201).json(saleProduct);
  },
};

module.exports = saleController;