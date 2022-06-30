const express = require('express');

const Product = require('./controllers/productsController');

const app = express();
// PR

app.get('/products', Product.getAll);

app.get('/products/:id', Product.findById);

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app;