const express = require('express');
const bodyParser = require('body-parser');

const Product = require('./controllers/productsController');
const Sale = require('./controllers/salesController');

const app = express();
// PR

app.use(bodyParser.json());

app.get('/products', Product.getAll);

app.get('/products/:id', Product.findById);

app.put('/products/:id', Product.updateProduct);

app.delete('/products/:id', Product.deleteProduct);

app.post('/products', Product.create);

app.post('/sales', Sale.createSaleProduct);

app.get('/sales', Sale.getAllList);

app.get('/sales/:id', Sale.findById);

app.put('/sales/:id', Sale.updateSale);

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app;