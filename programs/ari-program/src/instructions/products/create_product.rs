use crate::state::Product;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
#[instruction(product_id: String)]
pub struct CreateProduct<'info> {
    #[account(mut)]
    pub merchant: Signer<'info>,
    #[account(
        init,
        payer = merchant,
        space = Product::SIZE,
        seeds = [b"products", merchant.key().as_ref(), product_id.as_bytes()],
        bump
    )]
    pub product: Box<Account<'info, Product>>,
    pub currency_mint: Box<Account<'info, Mint>>,
    pub system_program: Program<'info, System>,
}

pub fn exe(
    ctx: Context<CreateProduct>,
    product_id: String,
    name: String,
    description: String,
    images: Vec<String>,
    currency_symbol: String,
    currency_decimals: u8,
    price: u64,
    stock: u64,
) -> Result<()> {
    ctx.accounts.product.id = product_id;
    ctx.accounts.product.name = name;
    ctx.accounts.product.description = description;
    ctx.accounts.product.images = images;
    ctx.accounts.product.currency = ctx.accounts.currency_mint.key();
    ctx.accounts.product.currency_symbol = currency_symbol;
    ctx.accounts.product.currency_decimals = currency_decimals;
    ctx.accounts.product.price = price;
    ctx.accounts.product.stock = stock;
    ctx.accounts.product.merchant = ctx.accounts.merchant.key();

    Ok(())
}
