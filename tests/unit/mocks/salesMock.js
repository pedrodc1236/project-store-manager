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

const getAllList = [
  [
    {
      "date": "2022-07-07T01:46:37.000Z",
      "saleId": 1,
      "productId": 2,
      "quantity": 10
    },
    {
      "date": "2022-07-07T01:46:37.000Z",
      "saleId": 2,
      "productId": 3,
      "quantity": 15
    }
  ]
]

const getAllListBefore = [
  [
    {
      "date": "2022-07-07T01:46:37.000Z",
      "sale_id": 1,
      "product_id": 2,
      "quantity": 10
    },
    {
      "date": "2022-07-07T01:46:37.000Z",
      "sale_id": 2,
      "product_id": 3,
      "quantity": 15
    }
  ]
]

const findByIdBefore = [
  [
    {
      "date": "2022-07-07T01:46:37.000Z",
      "product_id": 2,
      "quantity": 10
    }
  ]
]

const findByIdAfter = [
  [
    {
      "date": "2022-07-07T01:46:37.000Z",
      "productId": 2,
      "quantity": 10
    }
  ]
]

const mockFindById = [
  { "date": "2022-07-12T04:07:41.000Z", "productId": 1, "quantity": 5 },
  { "date": "2022-07-12T04:07:41.000Z", "productId": 2, "quantity": 10 }
]

const updateMock = [
  {
    "productId": 1,
    "quantity":10
  },
  {
    "productId": 2,
    "quantity":50
  }
]

const updateServiceReturn = {
  code: 200,
  update: {
    "saleId": 1,
    "itemsUpdated": [
      {
        "productId": 1,
        "quantity":10
      },
      {
        "productId": 1,
        "quantity":10
      }
    ]
  }
}

module.exports = {
  reqBody,
  reqBodyNotProductId,
  reqBodyNotQuantity,
  reqBodyQuantityNot0,
  reqBodyProductIdInexistent,
  returnCreateSale,
  getAllList,
  findByIdBefore,
  findByIdAfter,
  getAllListBefore,
  mockFindById,
  updateMock,
  updateServiceReturn
};