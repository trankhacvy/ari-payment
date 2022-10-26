use crate::state::{PaymentLink, Product};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(payment_link_id: String)]
pub struct CreatePaymentLink<'info> {
    #[account(mut)]
    pub merchant: Signer<'info>,
    #[account(
        constraint = product.merchant == merchant.key(),
    )]
    pub product: Box<Account<'info, Product>>,
    #[account(
        constraint = currency_mint.key() == product.currency,
    )]
    pub currency_mint: Box<Account<'info, Mint>>,
    #[account(
        constraint = merchant_token_account.owner == merchant.key(),
        constraint = merchant_token_account.mint == currency_mint.key()
    )]
    pub merchant_token_account: Box<Account<'info, TokenAccount>>,
    #[account(
        init,
        payer = merchant,
        space = PaymentLink::SIZE,
        seeds = [b"payment_links", merchant.key().as_ref(), payment_link_id.as_bytes()],
        bump
    )]
    pub payment_link: Box<Account<'info, PaymentLink>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exe(
    ctx: Context<CreatePaymentLink>,
    payment_link_id: String,
    phone_number_required: bool,
    shipping_address_required: bool,
    adjustable_quantity: bool,
) -> Result<()> {
    ctx.accounts.payment_link.id = payment_link_id;
    ctx.accounts.payment_link.product_id = ctx.accounts.product.id.clone();
    ctx.accounts.payment_link.merchant = ctx.accounts.product.merchant;
    ctx.accounts.payment_link.currency = ctx.accounts.product.currency;
    ctx.accounts.payment_link.currency_symbol = ctx.accounts.product.currency_symbol.clone();
    ctx.accounts.payment_link.currency_decimals = ctx.accounts.product.currency_decimals;
    ctx.accounts.payment_link.merchant_token_account = ctx.accounts.merchant_token_account.key();
    ctx.accounts.payment_link.phone_number_required = phone_number_required;
    ctx.accounts.payment_link.shipping_address_required = shipping_address_required;
    ctx.accounts.payment_link.adjustable_quantity = adjustable_quantity;

    Ok(())
}
