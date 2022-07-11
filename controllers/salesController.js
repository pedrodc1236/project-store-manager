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
  updateSale: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const updateResult = await saleService.updateSale(id, body);

    if (updateResult.message) {
      return res.status(updateResult.code).json({ message: updateResult.message });
    }

    res.status(updateResult.code).json(updateResult.update);
  },
  deleteSale: async (req, res) => {
    const { id } = req.params;
    const deleteResult = await saleService.deleteSale(id);

    if (deleteResult.message) {
      return res.status(deleteResult.code).json({ message: deleteResult.message });
    }

    res.status(204).end();
  },
};

module.exports = saleController;