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
        request.body = salesMock.returnCreateSale;
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
        request.body = salesMock.reqBodyProductIdInexistent;
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
    describe('Testando a função getAllList', () => {
      const response = {}
      const request = {}

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(saleService, 'getAllList').resolves(salesMock.getAllList[0]);
      })
      after(() => {
        sinon.restore();
      })
      it('Deve retornar o status 200', async () => {
        await salesController.getAllList(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      })
      it('Deve retornar a lista de vendas', async () => {
        await salesController.getAllList(request, response);
        expect(response.json.calledWith(salesMock.getAllList[0])).to.be.true;
      })
    });
    describe('Testando a função findById', () => {
      describe('Caso o id passado não seja valido', () => {
        const idNotValidReturn = { code: 404, message: 'Sale not found' };
        const response = {}
        const request = {}
        before(() => {
          request.params = { id: 50 };

          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(saleService, 'findById').resolves(idNotValidReturn);
        })
        after(() => {
          sinon.restore();
        })

        it('Deve retornar o status 404', async () => {
          await salesController.findById(request, response);
          expect(response.status.calledWith(404)).to.be.true;
        })
        it('O json deve retornar uma mensagem', async () => {
          await salesController.findById(request, response);
          expect(response.json.calledWith({ message: idNotValidReturn.message })).to.be.true;
        })
      })
      describe('Caso o id passado seja valido', () => {
        const response = {}
        const request = {}
        before(() => {
          request.params = { id: 1 };

          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(saleService, 'findById').resolves(salesMock.findByIdAfter[0]);
        })
        after(() => {
          sinon.restore();
        })

        it('Deve retornar o status 200', async () => {
          await salesController.findById(request, response);
          expect(response.status.calledWith(200)).to.be.true;
        })
        it('O json deve retornar um array de objetos esperado', async () => {
          await salesController.findById(request, response);
          expect(response.json.calledWith(salesMock.findByIdAfter[0])).to.be.true;
        })
      })
    })
  })
})