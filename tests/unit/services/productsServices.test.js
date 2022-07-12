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
  describe('Consulta se atualiza o nome de um produto', () => {
    describe('Caso o id ou name seja invalido', () => {
      describe('Caso não exista o campo name', () => {
        const nameNotExists = { id: 1, name: undefined }
        const returnError400 = { code: 400, message: '"name" is required' }
        before(() => {
          sinon.stub(productsModel, 'updateProduct').resolves(nameNotExists);
          sinon.stub(productsModel, 'findById').resolves({ id: 1, name: 'Martelo de Thor' });
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await productsService.updateProduct(1, undefined);
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await productsService.updateProduct(1, undefined);
          expect(response).to.be.deep.equal(returnError400);
        })
      })
      describe('Caso o campo name tenha menos de 5 caracteres', () => {
        const nameNotLengthRequired = { id: 1, name: 'Prod' }
        const returnError422 = {
          code: 422,
          message: '"name" length must be at least 5 characters long',
        };
        before(() => {
          sinon.stub(productsModel, 'updateProduct').resolves(nameNotLengthRequired);
          sinon.stub(productsModel, 'findById').resolves({ id: 1, name: 'Martelo de Thor' });
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await productsService.updateProduct(1, 'Prod');
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await productsService.updateProduct(1, 'Prod');
          expect(response).to.be.deep.equal(returnError422);
        })
      })
      describe('Caso o id do produto passado não exista', () => {
        const idNotExists = { id: 50, name: 'Martelo do Batman' }
        const productNotFound = { code: 404, message: 'Product not found' };
        before(() => {
          sinon.stub(productsModel, 'updateProduct').resolves(idNotExists);
          sinon.stub(productsModel, 'findById').resolves(null);
        })
        after(() => {
          sinon.restore();
        })

        it('Se retorna um objeto', async () => {
          const response = await productsService.updateProduct(50, 'Martelo do Batman');
          expect(response).to.be.a('object');
        })
        it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
          const response = await productsService.updateProduct(50, 'Martelo do Batman');
          expect(response).to.be.deep.equal(productNotFound);
        })
      })
    })
    describe('Caso o id e o nome são validos', () => {
      const idNameATT = { id: 1, name: "Martelo do Batman" }
      before(() => {
        sinon.stub(productsModel, 'updateProduct').resolves(idNameATT);
        sinon.stub(productsModel, 'findById').resolves({ id: 1, name: 'Martelo de Thor' });
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um objeto', async () => {
        const response = await productsService.updateProduct(idNameATT.id, idNameATT.name);
        expect(response).to.be.a('object');
      })
      it('Se retorna o objeto esperado caso dê tudo certo', async () => {
        const response = await productsService.updateProduct(idNameATT.id, idNameATT.name);
        expect(response).to.be.deep.equal(idNameATT);
      })
    })
  })
  describe('Consulta se deleta um produto através do id', () => {
    describe('Caso o id passado seja inválido', () => {
      const idNotExists = { id: 1, name: 'Martelo de Thor' }
      before(() => {
        sinon.stub(productsModel, 'deleteProduct').resolves(idNotExists);
        sinon.stub(productsModel, 'findById').resolves(null);
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um objeto', async () => {
        const response = await productsService.deleteProduct(idNotExists.id);
        expect(response).to.be.a('object');
      })
      it('Se retorna um objeto com as chaves code e message assim como esperado', async () => {
        const response = await productsService.deleteProduct(idNotExists.id);
        expect(response).to.be.deep.equal({ code: 404, message: 'Product not found' });
      })
    })
    describe('Caso o id passado seja válido', () => {
      const idValid = { id: 1, name: 'Martelo de Thor' }
      before(() => {
        sinon.stub(productsModel, 'deleteProduct').resolves(true);
        sinon.stub(productsModel, 'findById').resolves(idValid);
      })
      after(() => {
        sinon.restore();
      })

      it('Se retorna um boolean', async () => {
        const response = await productsService.deleteProduct(idValid.id);
        expect(response).to.be.a('boolean');
      })
      it('Se retorna true', async () => {
        const response = await productsService.deleteProduct(idValid.id);
        expect(response).to.be.true;
      })
    }) 
  })
  describe('Consulta se retorna a lista de produtos através da query', () => {
    before(() => {
      sinon.stub(productsModel, 'query').resolves([productsMock[0][0]]);
    })
    after(() => {
      sinon.restore();
    })

    it('Se retorna um array', async () => {
      const response = await productsService.query('Martelo');
      expect(response).to.be.a('array');
    })
    it('Se retorna o array com o objeto esperado', async () => {
      const response = await productsService.query('Martelo');
      expect(response).to.be.deep.equal([productsMock[0][0]]);
    })
  })
});

