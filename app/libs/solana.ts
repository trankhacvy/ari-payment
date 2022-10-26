import { Program, web3, utils, BN } from "@project-serum/anchor";
import { PublicKey, Connection, TransactionInstruction } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AriProgram } from "types/program";
import { Order, PaymentLink, Product } from "types/schema";
import { getAssociatedTokenAccountInstruction } from "utils/token";
import idl from "../idl.json";

export class Solana {
  program: Program<AriProgram>;

  constructor() {
    this.program = new Program<AriProgram>(
      idl as any,
      process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
    );
  }

  async createProduct(product: Product, merchant: PublicKey) {
    const [productPda, _] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("products"),
        merchant.toBuffer(),
        utils.bytes.utf8.encode(product.id),
      ],
      this.program.programId
    );
    const currencyMint = new PublicKey(product.currency);

    return this.program.methods
      .createProduct(
        product.id,
        product.name,
        product.description,
        product.images,
        product.currency_symbol,
        product.currency_decimals,
        new BN(product.price),
        new BN(product.stock)
      )
      .accounts({
        product: productPda,
        merchant,
        currencyMint,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

  async createPaymentLink(
    paymentLink: PaymentLink,
    merchant: PublicKey,
    connection: Connection
  ) {
    const [productPda, _] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("products"),
        merchant.toBuffer(),
        utils.bytes.utf8.encode(paymentLink.product_id),
      ],
      this.program.programId
    );

    const [paymentLinkPda, __] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("payment_links"),
        merchant.toBuffer(),
        utils.bytes.utf8.encode(paymentLink.id),
      ],
      this.program.programId
    );

    const currencyMint = new PublicKey(paymentLink.hackathon_products.currency);

    let merchantAta = await getAssociatedTokenAddress(currencyMint, merchant);
    const ix = await getAssociatedTokenAccountInstruction(
      merchant,
      currencyMint,
      merchantAta,
      connection
    );
    
    let preIxs: TransactionInstruction[] = [];
    if (ix) {
      preIxs.push(ix);
    }
    
    return this.program.methods
      .createPaymentLink(
        paymentLink.id,
        paymentLink.phone_number_required,
        paymentLink.shipping_address_required,
        paymentLink.adjustable_quantity
      )
      .accounts({
        product: productPda,
        merchant,
        currencyMint,
        paymentLink: paymentLinkPda,
        merchantTokenAccount: merchantAta,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(preIxs)
      .rpc();
  }

  async createOrder(order: Order, buyer: PublicKey, connection: Connection) {
    const merchant = new PublicKey(order.merchant);
    const [productPda, _] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("products"),
        merchant.toBuffer(),
        utils.bytes.utf8.encode(order.product_id),
      ],
      this.program.programId
    );

    const [orderPda, __] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("orders"),
        buyer.toBuffer(),
        utils.bytes.utf8.encode(order.id),
      ],
      this.program.programId
    );

    const [escrowPda, ___] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("escrow"),
        buyer.toBuffer(),
        utils.bytes.utf8.encode(order.id),
      ],
      this.program.programId
    );

    const currencyMint = new PublicKey(order.hackathon_payment_links.currency);
    let buyerAta = await getAssociatedTokenAddress(currencyMint, buyer);

    let preIx: TransactionInstruction[] = [];
    const ix = await getAssociatedTokenAccountInstruction(
      buyer,
      currencyMint,
      buyerAta,
      connection
    );

    let preIxs: TransactionInstruction[] = [];
    if (ix) {
      preIxs.push(ix);
    }

    return this.program.methods
      .createOrder(order.id, new BN(order.amount), new BN(order.quantity))
      .accounts({
        buyer,
        product: productPda,
        currencyMint,
        buyerTokenAccount: buyerAta,
        merchantTokenAccount: new PublicKey(order.merchant_token_account),
        order: orderPda,
        escrow: escrowPda,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(preIx)
      .rpc();
  }

  async deliverOrder(order: Order, merchant: PublicKey) {
    const buyer = new PublicKey(order.customer);
    const [productPda, _] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("products"),
        merchant.toBuffer(),
        utils.bytes.utf8.encode(order.product_id),
      ],
      this.program.programId
    );

    const [orderPda, __] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("orders"),
        buyer.toBuffer(),
        utils.bytes.utf8.encode(order.id),
      ],
      this.program.programId
    );

    const [escrowPda, ___] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("escrow"),
        buyer.toBuffer(),
        utils.bytes.utf8.encode(order.id),
      ],
      this.program.programId
    );

    const currencyMint = new PublicKey(order.hackathon_payment_links.currency);

    return this.program.methods
      .deliverOrder()
      .accounts({
        merchant,
        product: productPda,
        currencyMint,
        buyerTokenAccount: new PublicKey(order.customer_token_account),
        merchantTokenAccount: new PublicKey(order.merchant_token_account),
        order: orderPda,
        escrow: escrowPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  }

  async refund(order: Order, merchant: PublicKey) {
    const buyer = new PublicKey(order.customer);
    const [productPda, _] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("products"),
        merchant.toBuffer(),
        utils.bytes.utf8.encode(order.product_id),
      ],
      this.program.programId
    );

    const [orderPda, __] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("orders"),
        buyer.toBuffer(),
        utils.bytes.utf8.encode(order.id),
      ],
      this.program.programId
    );

    const [escrowPda, ___] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("escrow"),
        buyer.toBuffer(),
        utils.bytes.utf8.encode(order.id),
      ],
      this.program.programId
    );

    const currencyMint = new PublicKey(order.hackathon_payment_links.currency);

    return this.program.methods
      .refundOrder()
      .accounts({
        merchant,
        product: productPda,
        currencyMint,
        buyerTokenAccount: new PublicKey(order.customer_token_account),
        merchantTokenAccount: new PublicKey(order.merchant_token_account),
        order: orderPda,
        escrow: escrowPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  }
}
