import { PublicKey, Connection, TransactionInstruction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";

export const getAssociatedTokenAccountInstruction = async (
  payer: PublicKey,
  mint: PublicKey,
  ataAccount: PublicKey,
  connection: Connection
) => {
  let ix: TransactionInstruction | undefined = undefined;
  try {
    await getAccount(connection, ataAccount);
  } catch (error) {
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      ix = createAssociatedTokenAccountInstruction(
        payer,
        ataAccount,
        payer,
        mint
      );
    }
  }
  return ix;
};
