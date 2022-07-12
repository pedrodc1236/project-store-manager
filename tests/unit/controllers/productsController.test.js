const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');
const productsMock = require('../mocks/productsMock');
const { response } = require('express');

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

    describe('Consulta se insere um novo produto no BD', () => {
      describe('quando o "name" é inválido ou não existe', () => {
        const nameNotExists = { code: 400, message: '"name" is required' };
        const request = {};
        const response = {};
        before(() => {
          request.body = { name: '' };

          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productsService, 'create').resolves(nameNotExists);
        })
        after(() => {
          productsService.create.restore();
        })

        it('Se o "nome" não existir deve retornar o codigo 400', async () => {
          await productsController.create(request, response);

          expect(response.status.calledWith(nameNotExists.code)).to.be.true;
        })
        it('Se o "nome" não existir deve retornar a mensagem "name is required"', async () => {
          await productsController.create(request, response);

          expect(response.json.calledWith({ message: nameNotExists.message })).to.be.true;
        })
      })

      describe('quando o "nome" tem menos de 5 caracteres', () => {
        const productNotLengthValid = {
          code: 422,
          message: '"name" length must be at least 5 characters long',
        };
        const request = {};
        const response = {};
        before(() => {
          request.body = { name: 'Prod' };

          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productsService, 'create').resolves(productNotLengthValid);
        })
        after(() => {
          productsService.create.restore();
        });

        it('Se o "nome" conter menos de 5 caracteres deve retornar o codigo 422', async () => {
          await productsController.create(request, response);

          expect(response.status.calledWith(productNotLengthValid.code)).to.be.true;
        })
        it('Se o "nome" conter menos de 5 caracteres deve retornar a mensagem esperada', async () => {
          await productsController.create(request, response);

          expect(response.json.calledWith({ message: productNotLengthValid.message })).to.be.true;
        })
      })

      describe('Quando o "nome" é valído e o produto é criado com sucesso', () => {
        const productValid = {
          id: 4,
          name: 'ProductX'
        };
        const request = {};
        const response = {};
        before(() => {
          request.body = { name: 'ProductX' };

          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productsService, 'create').resolves(productValid);
        })
        after(() => {
          productsService.create.restore();
        })

        it('O status deve retornar o código 201', async () => {
          await productsController.create(request, response)

          expect(response.status.calledWith(201)).to.be.true;
        })
        it('O json deve retornar um objeto contendo o nome do produto e seu id', async () => {
          await productsController.create(request, response)

          expect(response.json.calledWith(productValid)).to.be.true;
        })
      })
    })
  })
  describe('Consulta se o produto é atualizado', () => {
    describe('Caso o name e id não sejam validos', () => {
      describe('Caso o nome não exista', () => {
        const nameUndefined = { code: 400, message: '"name" is required' };
        const request = {}
        const response = {}
        before(() => {
          request.params = { id: 1 }
          request.body = { name: undefined }
          
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productsService, 'updateProduct').resolves(nameUndefined);
        })
        after(() => {
          sinon.restore();
        })

        it('O status deve retornar o código 400', async () => {
          await productsController.updateProduct(request, response);
          expect(response.status.calledWith(400)).to.be.true;
        })
        it('Deve retornar a mensagem esperada', async () => {
          await productsController.updateProduct(request, response);
          expect(response.json.calledWith({ message: nameUndefined.message})).to.be.true;
        })
      })
      describe('Caso o nome tenha menos de 5 caracteres', () => {
        const nameLengthInvalid = {
          code: 422,
          message: '"name" length must be at least 5 characters long',
        };
        const request = {}
        const response = {}
        before(() => {
          request.params = { id: 1 }
          request.body = { name: 'Prod' }
          
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productsService, 'updateProduct').resolves(nameLengthInvalid);
        })
        after(() => {
          sinon.restore();
        })

        it('O status deve retornar o código 422', async () => {
          await productsController.updateProduct(request, response);
          expect(response.status.calledWith(422)).to.be.true;
        })
        it('Deve retornar a mensagem esperada', async () => {
          await productsController.updateProduct(request, response);
          expect(response.json.calledWith({ message: nameLengthInvalid.message})).to.be.true;
        })
      })
      describe('Caso o id passado não exista', () => {
        const idInvalid = { code: 404, message: 'Product not found' }
        const request = {}
        const response = {}
        before(() => {
          request.params = { id: 50 }
          request.body = { name: "Martelo do Batman" }
          
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productsService, 'updateProduct').resolves(idInvalid);
        })
        after(() => {
          sinon.restore();
        })

        it('O status deve retornar o código 404', async () => {
          await productsController.updateProduct(request, response);
          expect(response.status.calledWith(404)).to.be.true;
        })
        it('Deve retornar a mensagem esperada', async () => {
          await productsController.updateProduct(request, response);
          expect(response.json.calledWith({ message: idInvalid.message})).to.be.true;
        })
      })
    })
    describe('Caso o nome e o id sejam validos', () => {
      const idNameATT = { id: 1, name: "Martelo do Batman" }
      const request = {}
      const response = {}
      before(() => {
        request.params = { id: 1 }
        request.body = { name: "Martelo do Batman" }
        
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'updateProduct').resolves(idNameATT);
      })
      after(() => {
        sinon.restore();
      })

      it('O status deve retornar o código 200', async () => {
        await productsController.updateProduct(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      })
      it('O json deve retornar um objeto contendo o nome do produto e seu id', async () => {
        await productsController.updateProduct(request, response);
        expect(response.json.calledWith(idNameATT)).to.be.true;
      })
    })
  })
  describe('Consulta se o produto é deletado', () => {
    describe('Caso o id passado não seja valido', () => {
      const returnIdInvalid = { code: 404, message: 'Product not found' }
      const request = {}
      const response = {}
      before(() => {
        request.params = { id: 50 }

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'deleteProduct').resolves(returnIdInvalid);
      })
      after(() => {
        sinon.restore();
      })

      it('O status deve retornar o código 404', async () => {
        await productsController.deleteProduct(request, response);
        expect(response.status.calledWith(404)).to.be.true;
      })
      it('O json deve retornar a mensagem esperada', async () => {
        await productsController.deleteProduct(request, response);
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

        sinon.stub(productsService, 'deleteProduct').resolves(true);
      })
      after(() => {
        sinon.restore();
      })

      it('O status deve retornar o código 204', async () => {
        await productsController.deleteProduct(request, response);
        expect(response.status.calledWith(204)).to.be.true;
      })
    })
  })
  describe('Consulta se retorna a lista de produtos através da query', () => {
    const request = {}
    const response = {}
    before(() => {
      request.query = { q: 'Martelo' };

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(productsService, 'query').resolves([productsMock[0][0]]);
    })
    after(() => {
      sinon.restore();
    })

    it('O status deve retornar o código 200', async () => {
      await productsController.query(request, response);
      expect(response.status.calledWith(200)).to.be.true;
    })
    it('O json deve retornar um array de produtos com o nome passado na query', async () => {
      await productsController.query(request, response);
      expect(response.json.calledWith([productsMock[0][0]])).to.be.true;
    })
  })
});