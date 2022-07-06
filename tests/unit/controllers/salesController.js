const sinon = require('sinon');
const { expect } = require('chai');
const saleService = require('../../../services/salesService');
const salesController = require('../../../controllers/salesController');
const salesMock = require('../mocks/salesMock');

describe('Testando vendas camada de controle', () => {
  describe('Testa função createSaleProduct', () => {
    describe('Se der tudo certo', () => {
      const response = {}
      const request = {}

      before(() => {
        request.body = [
          {
            "productId": 1,
            "quantity":1
          },
          {
            "productId": 2,
            "quantity":5
          }
        ]
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(saleService, 'createSale').resolves(salesMock.returnCreateSale)
      })
      after(() => {
        saleService.createSale.restore();
      })
      
      it('Deve retornar o status 200', async () => {
        await salesController.createSaleProduct(request, response);
        expect(response.status.calledWith(201)).to.be.true;
      })
      it('Deve retornar o objeto esperado', async () => {
        await salesController.createSaleProduct(request, response);
        expect(response.json.calledWith(salesMock.returnCreateSale)).to.be.true;
      })
    })

    describe('Se não passar por alguma validação', () => {
      const response = {}
      const request = {}

      before(() => {
        request.body = [
          {
            "productId": 50,
            "quantity":1
          },
          {
            "productId": 2,
            "quantity":5
          }
        ]
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(saleService, 'createSale').resolves({ code: 404, message: 'Product not found' })
      })
      after(() => {
        saleService.createSale.restore();
      })
      it('Deve retornar o status 200', async () => {
        await salesController.createSaleProduct(request, response);
        expect(response.status.calledWith(404)).to.be.true;
      })
      it('Deve retornar a mensagem esperada', async () => {
        await salesController.createSaleProduct(request, response);
        expect(response.json.calledWith({ message: 'Product not found' })).to.be.true;
      })
    })
  })
})