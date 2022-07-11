const saleModel = require('../models/salesModel');

const isValid = (reqBody) => {
  const productIdExists = reqBody.every((el) => el.productId);
  const quantityExists = reqBody.every((el) => el.quantity || el.quantity === 0);
  const validQuantity = reqBody.every((el) => el.quantity > 0);
  if (!productIdExists) return { code: 400, message: '"productId" is required' };
  if (!quantityExists) return { code: 400, message: '"quantity" is required' };
  if (!validQuantity) {
    return {
      code: 422,
      message: '"quantity" must be greater than or equal to 1',
    };  
  } 
  return {};
};

const valid = (arrayNumber, products) => {
  let sum = 0;
  const productsValid = products;
  for (let i = 0; i < productsValid.length; i += 1) {
    if (arrayNumber.includes(productsValid[i].id)) {
      sum += 1;
    } 
  }
  if (arrayNumber.length !== sum) return false;

  return true;
};

let idSale;
let idUpdate;

const createSaleProduct = ({ productId, quantity }) => {
  const saleId = idSale;
  const saleProduct = saleModel.createSaleProduct({ saleId, productId, quantity });
  return saleProduct;
};

const updateSaleProduct = ({ productId, quantity }) => {
  const update = saleModel.updateSale(idUpdate, quantity, productId);
  return update;
};

const saleService = {
  createSale: async (reqBody) => {
    const isValidBody = isValid(reqBody);
    if (isValidBody.code) return isValidBody;
    const products = await saleModel.getAll();
    const arrayNumber = [];
    reqBody.forEach((el) => arrayNumber.push(el.productId));
    const validateId = await valid(arrayNumber, products);
    if (!validateId) return { code: 404, message: 'Product not found' };
    idSale = await saleModel.createSale();
    const sold = await Promise.all(reqBody.map(createSaleProduct));
    return { id: idSale, itemsSold: sold };
  },
  getAllList: async () => {
    const result = await saleModel.getAllList();
    const listSales = result.map(({ sale_id: saleId, date, product_id: productId, quantity }) => ({
      date,
      saleId,
      productId,
      quantity,
    }));
    return listSales;
  },
  findById: async (id) => {
    const result = await saleModel.findById(id);
    const specificSale = result.map(({ date, product_id: productId, quantity }) => ({
      date,
      productId,
      quantity,
    }));

    if (specificSale.length === 0) return { code: 404, message: 'Sale not found' };
    return specificSale;
  },
  updateSale: async (id, produtos) => {
    const validSale = await saleModel.findById(id);
    if (validSale.length === 0) return { code: 404, message: 'Sale not found' };
    const isValidProdutos = isValid(produtos);
    if (isValidProdutos.code) return isValidProdutos;
    const products = await saleModel.getAll();
    const arrayNumber = [];
    produtos.forEach((el) => arrayNumber.push(el.productId));
    const validateId = await valid(arrayNumber, products);
    if (!validateId) return { code: 404, message: 'Product not found' };
    idUpdate = id;
    const itemsUpdated = await Promise.all(produtos.map(updateSaleProduct));

    return { code: 200, update: { saleId: id, itemsUpdated } };
  },
}; 

module.exports = saleService;