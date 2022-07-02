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
});