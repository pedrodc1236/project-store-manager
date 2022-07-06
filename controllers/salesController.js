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
  getAllList: async (_req, res) => {
    const listSales = await saleService.getAllList();
    res.status(200).json(listSales);
  },
  findById: async (req, res) => {
    const { id } = req.params;
    const specificSale = await saleService.findById(id);

    if (specificSale.code) {
      return res.status(specificSale.code).json({ message: specificSale.message }); 
    }

    res.status(200).json(specificSale);
  },
};

module.exports = saleController;