import * as anchor from "@project-serum/anchor";
import { Program, Provider, web3, BN } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  mintTo,
  createAssociatedTokenAccount,
  getAccount,
} from "@solana/spl-token";
import { AriProgram } from "../target/types/ari_program";

export const handleAirdrop = async (
  provider: Provider,
  account: web3.PublicKey,
  amount: number = web3.LAMPORTS_PER_SOL
) => {
  const airdropSignature = await provider.connection.requestAirdrop(
    account,
    amount
  );
  await provider.connection.confirmTransaction(airdropSignature);
};

export const createProduct = async (
  program: Program<AriProgram>,
  productId: string,
  currencyMint: web3.PublicKey,
  price: number,
  merchant: web3.Keypair
) => {
  const name = `${productId} - IPhone 14`;
  const description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.";
  const images = ["https://google.com", "https://facebook.com"];
  const currencySymbol = "USDC";
  const currencyDecimals = 8;

  const [productPda, _] = await web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("products"),
      merchant.publicKey.toBuffer(),
      anchor.utils.bytes.utf8.encode(productId),
    ],
    program.programId
  );

  try {
    await program.methods
      .createProduct(
        productId,
        name,
        description,
        images,
        currencySymbol,
        currencyDecimals,
        new BN(price),
        new BN(1000)
      )
      .accounts({
        product: productPda,
        merchant: merchant.publicKey,
        currencyMint,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([merchant])
      .rpc();
  } catch (error) {
    console.error(error);
  }

  return {
    productPda,
  };
};

export const createPayment = async (
  program: Program<SelinaProgram>,
  paymentId: string,
  productId: string,
  amount: number,
  quantity: number,
  merchant: web3.Keypair,
  buyer: web3.Keypair,
  currencyMint: web3.PublicKey,
  buyerAta: web3.PublicKey,
  merchantAta: web3.PublicKey
) => {
  const [productPda, _] = await web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("products"),
      merchant.publicKey.toBuffer(),
      anchor.utils.bytes.utf8.encode(productId),
    ],
    program.programId
  );

  const [paymentPda, __] = await web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("payments"),
      buyer.publicKey.toBuffer(),
      anchor.utils.bytes.utf8.encode(productId),
    ],
    program.programId
  );

  const [escrowPda, ___] = await web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("escrow"),
      buyer.publicKey.toBuffer(),
      anchor.utils.bytes.utf8.encode(productId),
    ],
    program.programId
  );

  try {
    await program.methods
      .createPayment(paymentId, new BN(amount), new BN(quantity))
      .accounts({
        buyer: buyer.publicKey,
        product: productPda,
        currencyMint: currencyMint,
        buyerTokenAccount: buyerAta,
        merchantTokenAccount: merchantAta,
        payment: paymentPda,
        escrow: escrowPda,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([buyer])
      .rpc();
  } catch (error) {
    console.error(error);
  }

  return {
    paymentPda,
    escrowPda,
  };
};
