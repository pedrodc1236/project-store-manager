const reqBody = [
  {
    "productId": 1,
    "quantity": 1
  },
  {
    "productId": 2,
    "quantity": 5
  }
];

const reqBodyNotProductId = [
  {
    "quantity": 1
  },
  {
    "productId": 2,
    "quantity": 5
  }
];

const reqBodyNotQuantity = [
  {
    "productId": 1,
  },
  {
    "productId": 2,
    "quantity": 5
  }
];

const reqBodyQuantityNot0 = [
  {
    "productId": 1,
    "quantity": 0
  },
  {
    "productId": 2,
    "quantity": 5
  }
];

const reqBodyProductIdInexistent = [
  {
    "productId": 50,
    "quantity": 1
  },
  {
    "productId": 2,
    "quantity": 5
  }
];

const returnCreateSale = {
 "id": 3,
 "itemsSold": [
    {
      "productId": 1,
      "quantity":1
    },
    {
      "productId": 2,
      "quantity":5
    }
  ]
}

module.exports = {
  reqBody,
  reqBodyNotProductId,
  reqBodyNotQuantity,
  reqBodyQuantityNot0,
  reqBodyProductIdInexistent,
  returnCreateSale,
};