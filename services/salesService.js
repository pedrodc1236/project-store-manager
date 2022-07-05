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

let saleId;

const createSaleProduct = ({ productId, quantity }) => {
  const saleProduct = saleModel.createSaleProduct({ saleId, productId, quantity });
  return saleProduct;
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
    saleId = await saleModel.createSale();
    const sold = await Promise.all(reqBody.map(createSaleProduct));
    return { id: saleId, itemsSold: sold };
  },
}; 

module.exports = saleService;