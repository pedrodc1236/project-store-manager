const sinon = require('sinon');
const connection = require('../../../models/connection');
const productsMock = require('../mocks/productsMock');
const productsModel = require('../../../models/productsModel');
const { expect } = require('chai');

describe('Testando produtos camada de model', () => {
  describe('Consulta a listagem de todos os produtos', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves(productsMock);
    });
    after(() => {
      connection.execute.restore();
    });

    it('Deve retornar um array', async () => {
      const response = await productsModel.getAll();
      expect(response).to.be.a('array');
    });
    it('Deve ser o array esperado ', async () => {
      const response = await productsModel.getAll();
      expect(response).to.equal(productsMock[0]);
    });
  });

  describe('Consulta se retorna o produto através do seu id', () => {
    describe('Caso o id seja valido', () => {
      before(() => {
      sinon.stub(connection, 'execute').resolves(productsMock);
    });
    after(() => {
      connection.execute.restore();
    });

    it('Se retorna um objeto', async () => {
      const response = await productsModel.findById(1);
      expect(response).to.be.a('object');
    });
    it('Se retorna o objeto esperado caso o id seja valido', async () => {
      const response1 = await productsModel.findById();
      expect(response1).to.deep.equal(productsMock[0][0]);
    });
    })
    describe('Caso o id seja invalido', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      })
      after(() => {
        connection.execute.restore();
      })

      it('Se retorna null caso o id não seja valido', async () => {
      const response = await productsModel.findById(50);
      expect(response).to.equal(null);
    })
    })
  });

  describe('Consulta se insere um novo produto no BD', () => {
    const newProduct = { name: 'ProductX' };

    before(() => {
      sinon.stub(connection, 'execute').resolves([{ insertId: 4 }]);
    })
    after(() => {
      connection.execute.restore();
    })

    it('Se retorna um objeto', async () => {
      const response = await productsModel.create(newProduct.name);

      expect(response).to.be.a('object');
    })
    it('Se o objeto contém um id', async () => {
      const response = await productsModel.create(newProduct.name);

      expect(response).to.be.property('id');
    })
  });
  describe('Consulta se atualiza um produto', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves()
    })
    after(() => {
      sinon.restore();
    })

    it('Se retorna um objeto', async () => {
      const response = await productsModel.updateProduct(1, "Martelo do Batman");
      expect(response).to.be.a('object');
    })
    it('Se retorna o objeto esperado', async () => {
      const response = await productsModel.updateProduct(1, "Martelo do Batman");
      expect(response).to.be.deep.equal({ id: 1, name: "Martelo do Batman" })
    })
  })
  describe('Consulta se deleta um produto', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves()
    })
    after(() => {
      sinon.restore();
    })

    it('Se retorna um booleano', async () => {
      const response = await productsModel.deleteProduct(1);
      expect(response).to.be.a('boolean');
    })
    it('Se retorna true', async () => {
      const response = await productsModel.deleteProduct(1);
      expect(response).to.equal(true);
    })
  })
  describe('Consulta se retorna a lista de produtos através da query', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([[productsMock[0][0]]]);
    })
    after(() => {
      sinon.restore();
    })

    it('Se retorna um array', async () => {
      const response = await productsModel.query('Martelo');
      expect(response).to.be.a('array');
    })
    it('Se retorna o array de objeto esperado', async () => {
      const response = await productsModel.query('Martelo');
      expect(response).to.be.deep.equal([productsMock[0][0]]);
    })
  })
});