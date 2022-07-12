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
  describe('Testa a função updateSale', () => {
    describe('Caso o id ou produtos sejam invalidos', () => {
      describe('Caso não exista o campo productsId', () => {
        const productsNotExists = [
          {
            "quantity":10
          },
          {
            "productId": 2,
            "quantity":50
          }
        ]
        const returnError400 = { code: 400, message: '"productId" is required' }
        const request = {}
        const response = {}
        before(() => {
          request.params = { id: 1 }
          request.body = productsNotExists;
          
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(saleService, 'updateSale').resolves(returnError400);
        })
        after(() => {
          sinon.restore();
        })

        it('O status deve retornar o código 400', async () => {
          await salesController.updateSale(request, response);
          expect(response.status.calledWith(returnError400.code)).to.be.true;
        })
        it('Deve retornar a mensagem esperada', async () => {
          await salesController.updateSale(request, response);
          expect(response.json.calledWith({ message: returnError400.message})).to.be.true;
        })
      })
      describe('Caso não exista o campo quantity', () => {
        const quantityNotExists = [
          {
            "productId": 1,
          },
          {
            "productId": 2,
            "quantity":50
          }
        ]
        const returnError400 = { code: 400, message: '"quantity" is required' };
        const request = {}
        const response = {}
        before(() => {
          request.params = { id: 1 }
          request.body = quantityNotExists;
          
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(saleService, 'updateSale').resolves(returnError400);
        })
        after(() => {
          sinon.restore();
        })

        it('O status deve retornar o código 400', async () => {
          await salesController.updateSale(request, response);
          expect(response.status.calledWith(returnError400.code)).to.be.true;
        })
        it('Deve retornar a mensagem esperada', async () => {
          await salesController.updateSale(request, response);
          expect(response.json.calledWith({ message: returnError400.message})).to.be.true;
        })
      })
      describe('Caso quantity seja menor que 1', () => {
        const quantityNot = [
          {
            "productId": 1,
            "quantity":0
          },
          {
            "productId": 2,
            "quantity":50
          }
        ]
        const returnError422 = {
          code: 422,
          message: '"quantity" must be greater than or equal to 1',
        };
        const request = {}
        const response = {}
        before(() => {
          request.params = { id: 1 }
          request.body = quantityNot;
          
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(saleService, 'updateSale').resolves(returnError422);
        })
        after(() => {
          sinon.restore();
        })

        it('O status deve retornar o código 422', async () => {
          await salesController.updateSale(request, response);
          expect(response.status.calledWith(returnError422.code)).to.be.true;
        })
        it('Deve retornar a mensagem esperada', async () => {
          await salesController.updateSale(request, response);
          expect(response.json.calledWith({ message: returnError422.message})).to.be.true;
        })
      })
      describe('Caso o id do produto passado não exista', () => {
        const validSale = { code: 404, message: 'Sale not found' }  
        const request = {}
        const response = {}
        before(() => {
          request.params = { id: 50 }
          request.body = salesMock.updateMock;
          
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(saleService, 'updateSale').resolves(validSale);
        })
        after(() => {
          sinon.restore();
        })

        it('O status deve retornar o código 404', async () => {
          await salesController.updateSale(request, response);
          expect(response.status.calledWith(validSale.code)).to.be.true;
        })
        it('Deve retornar a mensagem esperada', async () => {
          await salesController.updateSale(request, response);
          expect(response.json.calledWith({ message: validSale.message})).to.be.true;
        })
      })
    })
    describe('Caso o id e os produtos sejam validos', () => {
      const request = {}
      const response = {}
      before(() => {
        request.params = { id: 1 }
        request.body = salesMock.updateMock;
        
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(saleService, 'updateSale').resolves(salesMock.updateServiceReturn);
      })
      after(() => {
        sinon.restore();
      })

      it('O status deve retornar o código 200', async () => {
        await salesController.updateSale(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      })
      it('O json deve retornar um objeto contendo o nome do produto e seu id', async () => {
        await salesController.updateSale(request, response);
        expect(response.json.calledWith(salesMock.updateServiceReturn.update)).to.be.true;
      })
    })
  })
  describe('Testando a função deleteSale', () => {
    describe('Caso o id passado não seja valido', () => {
      const returnIdInvalid = { code: 404, message: 'Sale not found' };
      const request = {}
      const response = {}
      before(() => {
        request.params = { id: 50 }

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(saleService, 'deleteSale').resolves(returnIdInvalid);
      })
      after(() => {
        sinon.restore();
      })

      it('O status deve retornar o código 404', async () => {
        await salesController.deleteSale(request, response);
        expect(response.status.calledWith(404)).to.be.true;
      })
      it('O json deve retornar a mensagem esperada', async () => {
        await salesController.deleteSale(request, response);
        expect(response.json.calledWith({ message: returnIdInvalid.message })).to.be.true;
      })
    })
    describe('Caso o id passado seja valido', () => {
      const request = {}
      const response = {}
      before(() => {
        request.params = { id: 1 }

        response.status = sinon.stub().returns(response);
        response.end = sinon.stub().returns();

        sinon.stub(saleService, 'deleteSale').resolves(true);
      })
      after(() => {
        sinon.restore();
      })

      it('O status deve retornar o código 204', async () => {
        await salesController.deleteSale(request, response);
        expect(response.status.calledWith(204)).to.be.true;
      })
    })
  })
})