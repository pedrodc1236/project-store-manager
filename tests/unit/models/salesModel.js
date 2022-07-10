const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../../models/connection');
const salesModel = require('../../../models/salesModel');
const productsMock = require('../mocks/productsMock');
const salesMock = require('../mocks/salesMock');

describe('Testando vendas camada de model', () => {
  describe('Testa função createSale', () => {
    const id = [{ insertId: 3 }];
    before(() => {
      sinon.stub(connection, 'execute').resolves(id);
    })
    after(() => {
      connection.execute.restore();
    })

    it('Se retorna um number', async () => {
      const result = await salesModel.createSale();
      expect(result).to.be.a('number');
    })
    it('Se retorna o id correto', async () => {
      const result = await salesModel.createSale();
      expect(result).to.be.equal(id[0].insertId);
    })
  });   

  describe('Testa função createSaleProduct', () => {
    const sold = { productId: 1, quantity: 1 }
    const paramSaleProduct = { saleId: 3, productId: 1, quantity: 1 }
    before(() => {
      sinon.stub(connection, 'execute').resolves(sold);
    })
    after(() => {
      connection.execute.restore();
    })

    it('Se retorna um objeto', async () => {
      const result = await salesModel.createSaleProduct(paramSaleProduct);
      expect(result).to.be.a('object');
    })
    it('Se retorna o objeto esperado', async () => {
      const result = await salesModel.createSaleProduct(paramSaleProduct);
      expect(result).to.be.deep.equal(sold);
    })
  })

  describe('Testa função getAll', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves(productsMock);
    })
    after(() => {
      connection.execute.restore();
    })

    it('Se retorna um array', async () => {
      const result = await salesModel.getAll();
      expect(result).to.be.a('array');
    })
    it('Se retorna o array de produtos corretamente', async () => {
      const result = await salesModel.getAll();
      expect(result).to.equal(productsMock[0])
    })
  });

  describe('Testa função getAllList', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves(salesMock.getAllList);
    })
    after(() => {
      connection.execute.restore();
    })

    it('Se retorna um array', async () => {
      const result = await salesModel.getAllList();
      expect(result).to.be.a('array');
    })
    it('Se retorna o array de objetos esperado', async () => {
      const result = await salesModel.getAllList();
      expect(result).to.equal(salesMock.getAllList[0]);
    })
  })

  describe('Testa função findById', () => {
    const idExists = 1;
    before(() => {
      sinon.stub(connection, 'execute').resolves(salesMock.findByIdBefore);
    })
    after(() => {
      connection.execute.restore();
    })

    it('Se retorna um array', async () => {
      const result = await salesModel.findById(idExists);
      expect(result).to.be.a('array');
    })
    it('Se retorna o array de objetos esperado', async () => {
      const result = await salesModel.findById(idExists);
      expect(result).to.equal(salesMock.findByIdBefore[0]);
    })
  })
});