use anchor_lang::prelude::*;

pub mod instructions;
pub use instructions::*;

pub mod state;
pub use state::*;

pub mod errors;
pub use errors::*;

declare_id!("74UigkEeKHT3PgQGUxXVfL2ghxK3tHYYc3LvZvi5rZH5");

#[program]
pub mod ari_program {

    use super::*;

    pub fn initialize_merchant(ctx: Context<InitializeMerchant>) -> Result<()> {
        initialize_merchant::exe(ctx)
    }

    // products

    pub fn create_product(
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
        create_product::exe(
            ctx,
            product_id,
            name,
            description,
            images,
            currency_symbol,
            currency_decimals,
            price,
            stock,
        )
    }

    /// PAYMENT LINKS

    pub fn create_payment_link(
        ctx: Context<CreatePaymentLink>,
        payment_id: String,
        phone_number_required: bool,
        shipping_address_required: bool,
        adjustable_quantity: bool,
    ) -> Result<()> {
        create_payment_link::exe(
            ctx,
            payment_id,
            phone_number_required,
            shipping_address_required,
            adjustable_quantity,
        )
    }

    // payments

    pub fn create_order(
        ctx: Context<CreateOrder>,
        id: String,
        amount: u64,
        quantity: u64,
    ) -> Result<()> {
        create_order::exe(ctx, id, amount, quantity)
    }

    pub fn cancel_payment(ctx: Context<CancelOrder>) -> Result<()> {
        cancel_order::exe(ctx)
    }

    pub fn deliver_order(ctx: Context<DeliverOrder>) -> Result<()> {
        deliver_order::exe(ctx)
    }

    pub fn refund_order(ctx: Context<RefundOrder>) -> Result<()> {
        refund_order::exe(ctx)
    }
}
