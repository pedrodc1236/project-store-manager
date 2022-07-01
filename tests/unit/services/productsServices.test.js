const sinon = require('sinon');
const { expect } = require('chai');
const productsMock = require('../mocks/productsMock');
const productsModel = require('../../../models/productsModel');
const productsService = require('../../../services/productsService');

describe('Testando a camada de serviço', () => {
  describe('Consulta a listagem de todos os produtos', () => {
    before(() => {
      sinon.stub(productsModel, 'getAll').resolves(productsMock[0]);
    })
    after(() => {
      productsModel.getAll.restore();
    })
    it('Retorna um array', async () => {
      const response = await productsService.getAll();
      expect(response).to.be.a('array');
    });
    it('Retorna o array esperado', async () => {
      const response = await productsService.getAll();
      expect(response).to.equal(productsMock[0]);
    });
  });

  describe('Consulta se retorna o produto através do seu id', () => {
    before(() => {
      sinon.stub(productsModel, 'findById').resolves(productsMock[0][0]);
    })
    after(() => {
      productsModel.findById.restore();
    })
    it('Retorna um objeto', async () => {
      const response = await productsService.findById(1);
      expect(response).to.be.a('object');
    });
    it('Retorna o objeto esperrado', async () => {
      const response = await productsService.findById(1);
      expect(response).to.deep.equal(productsMock[0][0]);
    })
  });

  describe('Se o id não existir', () => {
    before(() => {
      sinon.stub(productsModel, 'findById').resolves(null);
    })

    after(() => {
      productsModel.findById.restore();
    })

    const idInexistente = 50;
    it('Retorna nulo', async () => {
      const response = await productsService.findById(idInexistente);
      expect(response).to.deep.equal(null);
    });
  });
});

