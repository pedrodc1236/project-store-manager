const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');
const productsMock = require('../mocks/productsMock');

describe('Testando produtos camada de controle', () => {
  describe('Consulta a listagem de todos os produtos', () => {
    const response = {};
    const request = {};

    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, 'getAll').resolves(productsMock[0]);
    })
    after(() => {
      productsService.getAll.restore();
    })

    it('Deve retornar o status 200', async () => {
      await productsController.getAll(request, response);

      expect(response.status.calledWith(200)).to.be.equal(true);
    })
    it('Deve retornar um array de objetos', async () => {
      await productsController.getAll(request, response);
      
      expect(response.json.calledWith(productsMock[0]))
    })
  });

  describe('Consulta se retorna o produto através do seu id', () => {
    describe('Caso o id exista', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: 1 };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'findById').resolves(productsMock[0][0]);
      })
      after(() => {
        productsService.findById.restore();
      })
      it('Deve retornar status 200', async () => {
        await productsController.findById(request, response);

        expect(response.status.calledWith(200)).to.be.equal(true);
      })
      it('Deve retornar o objeto esperado', async () => {
        await productsController.findById(request, response);

        expect(response.json.calledWith(productsMock[0][0]))
          .to.be.true;
      })
    })

    describe('Caso o id não exista', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: 50 };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        
        sinon.stub(productsService, 'findById').resolves(null);
      })
      after(() => {
        productsService.findById.restore();
      })

      it('Deve retornar status 400', async () => {
        await productsController.findById(request, response);

        expect(response.status.calledWith(404)).to.be.true;
      })
      it('Deve retornar um objeto com uma messagem "Product not found"', async () => {
        await productsController.findById(request, response);

        expect(response.json.calledWith({ message: 'Product not found' })).to.be.true;
      })
    })
  })
});