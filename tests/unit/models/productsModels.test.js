const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../../models/connection');
const productsMock = require('../mocks/productsMock');
const productsModel = require('../../../models/productsModel');

describe('Testando produtos camada de model', () => {
  describe('Consulta a listagem de todos os produtos', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves(productsMock);
    });
    after(() => {
      connection.execute.restore();
    });

    it('Deve retornar um array', async () => {
      const response = await productsModel.getAll();
      expect(response).to.be.a('array');
    });
    it('Deve ser o array esperado ', async () => {
      const response = await productsModel.getAll();
      expect(response).to.equal(productsMock[0]);
    });
  });

  describe('Consulta se retorna o produto através do seu id', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves(productsMock);
    });
    after(() => {
      connection.execute.restore();
    });

    it('Se retorna um objeto', async () => {
      const response = await productsModel.findById(1);
      expect(response).to.be.a('object');
    });
    it('Se retorna o objeto esperado', async () => {
      const response1 = await productsModel.findById();
      expect(response1).to.deep.equal(productsMock[0][0]);
    });
  });

  describe('Consulta se insere um novo produto no BD', () => {
    const newProduct = { name: 'ProductX' };

    before(() => {
      sinon.stub(connection, 'execute').resolves([{ insertId: 4 }]);
    })
    after(() => {
      connection.execute.restore();
    })

    it('Se retorna um objeto', async () => {
      const response = await productsModel.create(newProduct.name);

      expect(response).to.be.a('object');
    })
    it('Se o objeto contém um id', async () => {
      const response = await productsModel.create(newProduct.name);

      expect(response).to.be.property('id');
    })
  });
});