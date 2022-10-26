use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Canceled order")]
    OrderAlreadyCancelled,
    #[msg("Accepted order")]
    OrderAlreadyAccepted,
    #[msg("Refunded order")]
    OrderAlreadyRefunded,
}
