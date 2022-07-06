const sinon = require('sinon');
const { expect } = require('chai');
const salesModel = require('../../../models/salesModel');
const saleService = require('../../../services/salesService');
const produckMock = require('../mocks/productsMock');
const salesMock = require('../mocks/salesMock');

describe('Testando vendas camada de servico', () => {
  describe('Testa função createSale', () => {
    describe('Se der tudo certo e passar pelas validações', () => {
      const idSold = 3;
      const saleProduct = { productId: 1, quantity: 1 }
      before(() => {
        sinon.stub(salesModel, 'createSale').resolves(idSold);
        sinon.stub(salesModel, 'createSaleProduct').resolves(saleProduct);
        sinon.stub(salesModel, 'getAll').resolves(produckMock[0]);
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBody);
        expect(result).to.be.a('object');
      })
      it('Se retorna o objeto esperado tem uma chave contendo um array', async () => {
        const result = await saleService.createSale(salesMock.reqBody);
        expect(result.itemsSold).to.be.a('array');
      })
    })
    
    describe('Se der errado e não passar pelas validações', () => {
      const idSold = 3;
      const saleProduct = { productId: 1, quantity: 1 }
      before(() => {
        sinon.stub(salesModel, 'createSale').resolves(idSold);
        sinon.stub(salesModel, 'createSaleProduct').resolves(saleProduct);
        sinon.stub(salesModel, 'getAll').resolves(produckMock[0]);
      })
      after(() => {
        sinon.restore();
      })
      it('Se não houver o campo "product" em alguma das vendas devera retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotProductId);
        expect(result).to.be.a('object');
      })
      it('Se não houver o campo "product" em alguma das vendas devera retornar uma chave code com o status 400', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotProductId);
        expect(result.code).to.be.equal(400);
      })
      it('Se não houver o campo "product" em alguma das vendas devera retornar uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotProductId);
        expect(result.message).to.be.equal('"productId" is required');
      })
      it('Se não houver o campo "quantity" em alguma das vendas devera retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotQuantity);
        expect(result).to.be.a('object');
      })
      it('Se não houver o campo "quantity" em alguma das vendas devera retornar uma chave code com o status 400', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotQuantity);
        expect(result.code).to.be.equal(400);
      })
      it('Se não houver o campo "quantity" em alguma das vendas devera retornar uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotQuantity);
        expect(result.message).to.be.equal('"quantity" is required')
      })
      it('Se o campo quantity for menor ou igual a 0 deverá retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyQuantityNot0);
        expect(result).to.be.a('object');
      })
      it('Se o campo quantity for menor ou igual a 0 deverá retornar um objeto com a chave code e o status 422', async () => {
        const result = await saleService.createSale(salesMock.reqBodyQuantityNot0);
        expect(result.code).to.be.equal(422);
      })
      it('Se o campo quantity for menor ou igual a 0 deverá retornar um objeto com uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyQuantityNot0);
        expect(result.message).to.be.equal('"quantity" must be greater than or equal to 1');
      })
      it('Se o campo productId é referente a um produto inexistente deverá retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyProductIdInexistent);
        expect(result).to.be.a('object');
      })
      it('Se o campo productId é referente a um produto inexistente deverá retornar um objeto com uma chave code e o status 404', async () => {
        const result = await saleService.createSale(salesMock.reqBodyProductIdInexistent);
        expect(result.code).to.be.equal(404);
      })
      it('Se o campo productId é referente a um produto inexistente deverá retornar um objeto com uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyProductIdInexistent);
        expect(result.message).to.be.equal('Product not found');
      })
    })
  })
})