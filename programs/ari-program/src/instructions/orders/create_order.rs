use crate::state::{Order, Product};
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(order_id: String)]
pub struct CreateOrder<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub product: Box<Account<'info, Product>>,
    #[account(
        constraint = currency_mint.key() == product.currency,
    )]
    pub currency_mint: Box<Account<'info, Mint>>,
    #[account(
        mut,
        constraint = buyer_token_account.owner == buyer.key(),
        constraint = buyer_token_account.mint == currency_mint.key()
    )]
    pub buyer_token_account: Box<Account<'info, TokenAccount>>,
    #[account(
        constraint = merchant_token_account.owner == product.merchant,
        constraint = merchant_token_account.mint == currency_mint.key()
    )]
    pub merchant_token_account: Box<Account<'info, TokenAccount>>,
    #[account(
        init,
        payer = buyer,
        space = Order::SIZE,
        seeds = [b"orders", buyer.key().as_ref(), order_id.as_bytes()],
        bump
    )]
    pub order: Box<Account<'info, Order>>,
    #[account(init,
        token::mint = currency_mint,
        token::authority = order,
        seeds = [b"escrow", buyer.key().as_ref(), order_id.as_bytes()],
        bump,
        payer = buyer
    )]
    pub escrow: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exe(ctx: Context<CreateOrder>, order_id: String, amount: u64, quantity: u64) -> Result<()> {
    if amount < quantity * ctx.accounts.product.price {
        return err!(ErrorCode::InvalidAmount);
    }

    ctx.accounts.order.id = order_id;
    ctx.accounts.order.product_id = ctx.accounts.product.id.clone();
    ctx.accounts.order.merchant = ctx.accounts.product.merchant;
    ctx.accounts.order.merchant_token_account = ctx.accounts.merchant_token_account.key();
    ctx.accounts.order.customer = ctx.accounts.buyer.key();
    ctx.accounts.order.customer_token_account = ctx.accounts.buyer_token_account.key();
    ctx.accounts.order.currency = ctx.accounts.currency_mint.key();
    ctx.accounts.order.amount = amount;
    ctx.accounts.order.quantity = quantity;

    // transfer payment to escrow
    let cpi_accounts = Transfer {
        from: ctx.accounts.buyer_token_account.to_account_info(),
        to: ctx.accounts.escrow.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    Ok(())
}
