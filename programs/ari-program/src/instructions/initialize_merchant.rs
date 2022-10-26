use anchor_lang::prelude::*;
use crate::state::{Merchant};

#[derive(Accounts)]
pub struct InitializeMerchant<'info> {
    merchant: Account<'info, Merchant>
}

pub fn exe(
    ctx: Context<InitializeMerchant>,
) -> Result<()> {
    ctx.accounts.merchant.products = vec!();    

    Ok(())
}
