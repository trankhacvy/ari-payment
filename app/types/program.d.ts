export type AriProgram = {
  "version": "0.1.0",
  "name": "ari_program",
  "instructions": [
    {
      "name": "initializeMerchant",
      "accounts": [
        {
          "name": "merchant",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createProduct",
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "productId",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "images",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "currencySymbol",
          "type": "string"
        },
        {
          "name": "currencyDecimals",
          "type": "u8"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "stock",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createPaymentLink",
      "docs": [
        "PAYMENT LINKS"
      ],
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "paymentLink",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "paymentId",
          "type": "string"
        },
        {
          "name": "phoneNumberRequired",
          "type": "bool"
        },
        {
          "name": "shippingAddressRequired",
          "type": "bool"
        },
        {
          "name": "adjustableQuantity",
          "type": "bool"
        }
      ]
    },
    {
      "name": "createOrder",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "quantity",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelPayment",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deliverOrder",
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "refundOrder",
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "merchant",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "products",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "product",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "images",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "currencySymbol",
            "type": "string"
          },
          {
            "name": "currencyDecimals",
            "type": "u8"
          },
          {
            "name": "merchant",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "stock",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "paymentLink",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "productId",
            "type": "string"
          },
          {
            "name": "merchant",
            "type": "publicKey"
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "currencySymbol",
            "type": "string"
          },
          {
            "name": "currencyDecimals",
            "type": "u8"
          },
          {
            "name": "merchantTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "phoneNumberRequired",
            "type": "bool"
          },
          {
            "name": "shippingAddressRequired",
            "type": "bool"
          },
          {
            "name": "adjustableQuantity",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "productId",
            "type": "string"
          },
          {
            "name": "merchant",
            "type": "publicKey"
          },
          {
            "name": "merchantTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "customerTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          },
          {
            "name": "delivered",
            "type": "bool"
          },
          {
            "name": "cancelled",
            "type": "bool"
          },
          {
            "name": "refunded",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6001,
      "name": "OrderAlreadyCancelled",
      "msg": "Canceled order"
    },
    {
      "code": 6002,
      "name": "OrderAlreadyAccepted",
      "msg": "Accepted order"
    },
    {
      "code": 6003,
      "name": "OrderAlreadyRefunded",
      "msg": "Refunded order"
    }
  ]
};

export const IDL: AriProgram = {
  "version": "0.1.0",
  "name": "ari_program",
  "instructions": [
    {
      "name": "initializeMerchant",
      "accounts": [
        {
          "name": "merchant",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createProduct",
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "productId",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "images",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "currencySymbol",
          "type": "string"
        },
        {
          "name": "currencyDecimals",
          "type": "u8"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "stock",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createPaymentLink",
      "docs": [
        "PAYMENT LINKS"
      ],
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "paymentLink",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "paymentId",
          "type": "string"
        },
        {
          "name": "phoneNumberRequired",
          "type": "bool"
        },
        {
          "name": "shippingAddressRequired",
          "type": "bool"
        },
        {
          "name": "adjustableQuantity",
          "type": "bool"
        }
      ]
    },
    {
      "name": "createOrder",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "quantity",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelPayment",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deliverOrder",
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "refundOrder",
      "accounts": [
        {
          "name": "merchant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "product",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "merchant",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "products",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "product",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "images",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "currencySymbol",
            "type": "string"
          },
          {
            "name": "currencyDecimals",
            "type": "u8"
          },
          {
            "name": "merchant",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "stock",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "paymentLink",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "productId",
            "type": "string"
          },
          {
            "name": "merchant",
            "type": "publicKey"
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "currencySymbol",
            "type": "string"
          },
          {
            "name": "currencyDecimals",
            "type": "u8"
          },
          {
            "name": "merchantTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "phoneNumberRequired",
            "type": "bool"
          },
          {
            "name": "shippingAddressRequired",
            "type": "bool"
          },
          {
            "name": "adjustableQuantity",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "productId",
            "type": "string"
          },
          {
            "name": "merchant",
            "type": "publicKey"
          },
          {
            "name": "merchantTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "customerTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          },
          {
            "name": "delivered",
            "type": "bool"
          },
          {
            "name": "cancelled",
            "type": "bool"
          },
          {
            "name": "refunded",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6001,
      "name": "OrderAlreadyCancelled",
      "msg": "Canceled order"
    },
    {
      "code": 6002,
      "name": "OrderAlreadyAccepted",
      "msg": "Accepted order"
    },
    {
      "code": 6003,
      "name": "OrderAlreadyRefunded",
      "msg": "Refunded order"
    }
  ]
};
