const sinon = require('sinon');
const { expect } = require('chai');
const salesModel = require('../../../models/salesModel');
const saleService = require('../../../services/salesService');
const produckMock = require('../mocks/productsMock');
const salesMock = require('../mocks/salesMock');

describe('Testando vendas camada de servico', () => {
  describe('Testa função createSale', () => {
    describe('Se der tudo certo e passar pelas validações', () => {
      const idSold = 3;
      const saleProduct = { productId: 1, quantity: 1 }
      before(() => {
        sinon.stub(salesModel, 'createSale').resolves(idSold);
        sinon.stub(salesModel, 'createSaleProduct').resolves(saleProduct);
        sinon.stub(salesModel, 'getAll').resolves(produckMock[0]);
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBody);
        expect(result).to.be.a('object');
      })
      it('Se retorna o objeto esperado tem uma chave contendo um array', async () => {
        const result = await saleService.createSale(salesMock.reqBody);
        expect(result.itemsSold).to.be.a('array');
      })
    })
    
    describe('Se der errado e não passar pelas validações', () => {
      const idSold = 3;
      const saleProduct = { productId: 1, quantity: 1 }
      before(() => {
        sinon.stub(salesModel, 'createSale').resolves(idSold);
        sinon.stub(salesModel, 'createSaleProduct').resolves(saleProduct);
        sinon.stub(salesModel, 'getAll').resolves(produckMock[0]);
      })
      after(() => {
        sinon.restore();
      })
      it('Se não houver o campo "product" em alguma das vendas devera retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotProductId);
        expect(result).to.be.a('object');
      })
      it('Se não houver o campo "product" em alguma das vendas devera retornar uma chave code com o status 400', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotProductId);
        expect(result.code).to.be.equal(400);
      })
      it('Se não houver o campo "product" em alguma das vendas devera retornar uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotProductId);
        expect(result.message).to.be.equal('"productId" is required');
      })
      it('Se não houver o campo "quantity" em alguma das vendas devera retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotQuantity);
        expect(result).to.be.a('object');
      })
      it('Se não houver o campo "quantity" em alguma das vendas devera retornar uma chave code com o status 400', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotQuantity);
        expect(result.code).to.be.equal(400);
      })
      it('Se não houver o campo "quantity" em alguma das vendas devera retornar uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyNotQuantity);
        expect(result.message).to.be.equal('"quantity" is required')
      })
      it('Se o campo quantity for menor ou igual a 0 deverá retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyQuantityNot0);
        expect(result).to.be.a('object');
      })
      it('Se o campo quantity for menor ou igual a 0 deverá retornar um objeto com a chave code e o status 422', async () => {
        const result = await saleService.createSale(salesMock.reqBodyQuantityNot0);
        expect(result.code).to.be.equal(422);
      })
      it('Se o campo quantity for menor ou igual a 0 deverá retornar um objeto com uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyQuantityNot0);
        expect(result.message).to.be.equal('"quantity" must be greater than or equal to 1');
      })
      it('Se o campo productId é referente a um produto inexistente deverá retornar um objeto', async () => {
        const result = await saleService.createSale(salesMock.reqBodyProductIdInexistent);
        expect(result).to.be.a('object');
      })
      it('Se o campo productId é referente a um produto inexistente deverá retornar um objeto com uma chave code e o status 404', async () => {
        const result = await saleService.createSale(salesMock.reqBodyProductIdInexistent);
        expect(result.code).to.be.equal(404);
      })
      it('Se o campo productId é referente a um produto inexistente deverá retornar um objeto com uma chave message', async () => {
        const result = await saleService.createSale(salesMock.reqBodyProductIdInexistent);
        expect(result.message).to.be.equal('Product not found');
      })
    })
  })

  describe('Testa função getAllList', () => {
    before(() => {
      sinon.stub(salesModel, 'getAllList').resolves(salesMock.getAllListBefore[0]);
    })
    after(() => {
      salesModel.getAllList.restore();
    })
    it('Se retorna um array', async () => {
      const result = await saleService.getAllList();
      expect(result).to.be.a('array');
    });
    it('Se retorna o array de objetos esperado', async () => {
      const result = await saleService.getAllList();
      expect(result).to.be.deep.equal(salesMock.getAllList[0]);
    })
  })

  describe('Testa função findById', () => {
    describe('Caso o id passado seja invalido', () => {
      const idInvalidReturn = { code: 404, message: 'Sale not found' }
      const id = 50;
      before(() => {
        sinon.stub(salesModel, 'findById').resolves([])
      })
      after(() => {
        salesModel.findById.restore();
      })

      it('Se retorna um objeto', async () => {
        const result = await saleService.findById(id);
        expect(result).to.be.a('object');
      })
      it('Se retorna o objeto esperado', async () => {
        const result = await saleService.findById(id);
        expect(result).to.be.deep.equal(idInvalidReturn);
      })
    })
    describe('Caso o id passado seja valido', () => {
      const id = 1;
      before(() => {
        sinon.stub(salesModel, 'findById').resolves(salesMock.findByIdBefore[0])
      })
      after(() => {
        salesModel.findById.restore();
      })

      it('Se retorna um array', async () => {
        const result = await saleService.findById(id);
        expect(result).to.be.a('array');
      });
      it('Se retorna o array de objetos esperado', async () => {
        const result = await saleService.findById(id);
        expect(result).to.be.deep.equal(salesMock.findByIdAfter[0]);
      });
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
        before(() => {
          sinon.stub(salesModel, 'updateSale').resolves(productsNotExists[0]);
          sinon.stub(salesModel, 'findById').resolves(salesMock.mockFindById);
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await saleService.updateSale(1, productsNotExists);
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await saleService.updateSale(1, productsNotExists);
          expect(response).to.be.deep.equal(returnError400);
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
        const returnError400 = { code: 400, message: '"quantity" is required' };;
        before(() => {
          sinon.stub(salesModel, 'updateSale').resolves(quantityNotExists[0]);
          sinon.stub(salesModel, 'findById').resolves(salesMock.mockFindById);
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await saleService.updateSale(1, quantityNotExists);
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await saleService.updateSale(1, quantityNotExists);
          expect(response).to.be.deep.equal(returnError400);
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
        before(() => {
          sinon.stub(salesModel, 'updateSale').resolves(quantityNot[0]);
          sinon.stub(salesModel, 'findById').resolves(salesMock.mockFindById);
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await saleService.updateSale(1, quantityNot);
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await saleService.updateSale(1, quantityNot);
          expect(response).to.be.deep.equal(returnError422);
        })
      })
      describe('Caso o id do produto passado não exista', () => {
        const idNotExists = 50;
        const validSale = { code: 404, message: 'Sale not found' }        
        before(() => {
          sinon.stub(salesModel, 'updateSale').resolves(salesMock.updateMock[0]);
          sinon.stub(salesModel, 'findById').resolves([]);
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await saleService.updateSale(idNotExists, salesMock.updateMock);
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await saleService.updateSale(idNotExists, salesMock.updateMock);
          expect(response).to.be.deep.equal(validSale);
        })
      })
    })
     describe('Caso o productI seja de um produto que não exista', () => {
        const quantityNot = [
          {
            "productId": 50,
            "quantity":10
          },
          {
            "productId": 2,
            "quantity":50
          }
        ]
        const returnError404 = { code: 404, message: 'Product not found' }
        before(() => {
          sinon.stub(salesModel, 'updateSale').resolves(quantityNot[0]);
          sinon.stub(salesModel, 'findById').resolves(salesMock.mockFindById);
          sinon.stub(salesModel, 'getAll').resolves(produckMock[0]);
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await saleService.updateSale(1, quantityNot);
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await saleService.updateSale(1, quantityNot);
          expect(response).to.be.deep.equal(returnError404);
        })
      })
    describe('Caso o id e os produtos sejam validos', () => {
      const idValid = 1;
      before(() => {
        sinon.stub(salesModel, 'updateSale').resolves(salesMock.updateMock[0]);
        sinon.stub(salesModel, 'findById').resolves(salesMock.mockFindById);
        sinon.stub(salesModel, 'getAll').resolves(produckMock[0]);
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um objeto', async () => {
        const response = await saleService.updateSale(idValid, salesMock.updateMock);
        expect(response).to.be.a('object');
      })
      it('Se retorna o objeto esperado caso dê tudo certo', async () => {
        const response = await saleService.updateSale(idValid, salesMock.updateMock);
        expect(response).to.be.deep.equal(salesMock.updateServiceReturn);
      })
    })
  })
  describe('Testa função deleteSale', () => {
    describe('Caso o id passado seja inválido', () => {
      const idNotExists = 50;
      before(() => {
        sinon.stub(salesModel, 'deleteSale').resolves(true);
        sinon.stub(salesModel, 'findById').resolves([]);
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um objeto', async () => {
        const response = await saleService.deleteSale(idNotExists);
        expect(response).to.be.a('object');
      })
      it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
        const response = await saleService.deleteSale(idNotExists);
        expect(response).to.be.deep.equal({ code: 404, message: 'Sale not found' });
      })
    })
    describe('Caso o id passado seja válido', () => {
      const idValid = 1;
      before(() => {
        sinon.stub(salesModel, 'deleteSale').resolves(true);
        sinon.stub(salesModel, 'findById').resolves(salesMock.mockFindById);
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um boolean', async () => {
        const response = await saleService.deleteSale(idValid);
        expect(response).to.be.a('boolean');
      })
      it('Se retorna true', async () => {
        const response = await saleService.deleteSale(idValid);
        expect(response).to.deep.equal(true);
      })
    })
  })
})