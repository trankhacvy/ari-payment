use anchor_lang::prelude::*;

#[account]
pub struct Merchant {
    pub authority: Pubkey,
    pub products: Vec<String>
}

#[account]
pub struct Product {
    pub id: String,
    pub name: String,
    pub description: String,
    pub images: Vec<String>,
    pub currency: Pubkey,
    pub currency_symbol: String,
    pub currency_decimals: u8,
    pub merchant: Pubkey,
    pub price: u64,
    pub stock: u64,
}

impl Product {
    pub const SIZE: usize = 8 + 
    (4 + 256) + // id
    (4 + 256) + // name
    (4 + 1000) + // description
    (4 + 5 * (4 + 1000)) + // max 5 images
    32 + // currency
    (4 + 6) + // currency_symbol
    32 + // merchant
    8 + // stock
    2 + // currency_decimals
    8; // price
}


#[account]
pub struct PaymentLink {
    pub id: String,
    pub product_id: String,
    pub merchant: Pubkey,
    pub currency: Pubkey,
    pub currency_symbol: String,
    pub currency_decimals: u8,
    pub merchant_token_account: Pubkey,
    pub phone_number_required: bool,
    pub shipping_address_required: bool,
    pub adjustable_quantity: bool,
}

impl PaymentLink {
    pub const SIZE: usize = 8 + 
    (4 + 256) + // id
    (4 + 256) + // product_id
    32 + // merchant
    32 + // merchant_token_account
    32 + // currency
    (4 + 6) + // currency_symbol
    2 + // currency_decimals
    1 + // phone_number_required
    1 + // shipping_address_required
    1; // adjustable_quantity
}

#[account]
pub struct Order {
    pub id: String,
    pub product_id: String,
    pub merchant: Pubkey,
    pub merchant_token_account: Pubkey,
    pub customer: Pubkey,
    pub customer_token_account: Pubkey,
    pub currency: Pubkey,
    pub amount: u64,
    pub quantity: u64,
    pub delivered: bool,
    pub cancelled: bool,
    pub refunded: bool,
}

impl Order {
    pub const SIZE: usize = 8 + 
    (4 + 256) + // product_id
    32 + // merchant
    32 + // merchant_token_account
    32 + // customer
    32 + // customer_token_account
    32 + // currency
    8 + // amount
    8 + // quantity
    1 + // delivered
    1 + // cancelled
    1; // refunded
}