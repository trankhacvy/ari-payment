use crate::errors::ErrorCode;
use crate::state::{Order, Product};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct CancelOrder<'info> {
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
        constraint = merchant_token_account.owner == order.merchant,
        constraint = merchant_token_account.mint == currency_mint.key()
    )]
    pub merchant_token_account: Box<Account<'info, TokenAccount>>,
    #[account(
        seeds = [b"orders", order.customer.as_ref(), order.id.as_bytes()],
        bump
    )]
    pub order: Box<Account<'info, Order>>,
    #[account(mut,
        token::mint = currency_mint,
        token::authority = order,
        seeds = [b"escrow", order.customer.as_ref(), order.id.as_bytes()],
        bump,
    )]
    pub escrow: Box<Account<'info, TokenAccount>>,
    pub token_program: Program<'info, Token>,
}

pub fn exe(ctx: Context<CancelOrder>) -> Result<()> {
    if ctx.accounts.order.cancelled {
        return err!(ErrorCode::OrderAlreadyCancelled);
    }
    ctx.accounts.order.cancelled = true;

    // transfer back payment from escrow to buyer
    let buyer_key = ctx.accounts.order.customer;
    let seeds = &[
        b"orders",
        buyer_key.as_ref(),
        ctx.accounts.order.id.as_bytes(),
        &[*ctx.bumps.get("order").unwrap()],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow.to_account_info(),
        to: ctx.accounts.buyer_token_account.to_account_info(),
        authority: ctx.accounts.order.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::transfer(cpi_ctx, ctx.accounts.order.amount)?;

    // TODO close escrow account

    Ok(())
}
