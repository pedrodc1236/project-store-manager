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

   describe('Consulta se insere um novo produto no BD', () => {
     describe('quando o "name" é inválido ou não existe', () => {
       const productNotExists = { name: '' };
       const productNotLengthValid = { name: 'prod' }
       before(() => {
         sinon.stub(productsModel, 'create').resolves({ id: 4 })
       })
       after(() => {
         productsModel.create.restore();
       })
       
       it('Se o "nome" não existir deve retornar uma mensagem e um codigo 400', async () => {
         const response = await productsService.create(productNotExists.name)
         
         expect(response.code).to.deep.equal(400);
       })
       it('Se o "nome" não tiver pelo menos 5 caracteres deve retornar uma mensagem e o codigo 422', async () => {
         const response = await productsService.create(productNotLengthValid.name)
         
         expect(response.code).to.deep.equal(422);
       })
     })

     describe('Quando é inserido com sucesso', () => {
       const productValid = { name: 'ProductX' }
       before(() => {
        sinon.stub(productsModel, 'create').resolves({ id: 4, name: 'ProductX' })
       })
       after(() => {
         productsModel.create.restore();
       })

       it('Se retorna um objeto', async () => {
         const response = await productsService.create(productValid.name);

         expect(response).to.be.a('object');
       })
       it ('Se retorna um objeto com as propriedades "id" e "name"', async () => {
         const response = await productsService.create(productValid.name);

         expect(response).to.includes.all.keys('id', 'name');
       })
     })
  });
});

