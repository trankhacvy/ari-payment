import { assert } from "chai";
import * as anchor from "@project-serum/anchor";
import { Program, web3, BN } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  mintTo,
  createAssociatedTokenAccount,
  getAccount,
} from "@solana/spl-token";
import { AriProgram } from "../target/types/ari_program";
import { handleAirdrop, createProduct, createPayment } from "./utils";

describe("ari-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SelinaProgram as Program<AriProgram>;
  let merchant: web3.Keypair;
  let buyer: web3.Keypair;
  let currencyMint: web3.PublicKey;
  let merchantAta: web3.PublicKey;
  let buyerAta: web3.PublicKey;

  beforeEach(async () => {
    merchant = web3.Keypair.generate();
    buyer = web3.Keypair.generate();
    // airdrop
    await handleAirdrop(provider, merchant.publicKey);
    await handleAirdrop(provider, buyer.publicKey);
    // init mint
    currencyMint = await createMint(
      provider.connection,
      merchant,
      merchant.publicKey,
      null,
      8,
      web3.Keypair.generate()
    );
    // merchant ata
    merchantAta = await createAssociatedTokenAccount(
      provider.connection,
      merchant,
      currencyMint,
      merchant.publicKey
    );

    buyerAta = await createAssociatedTokenAccount(
      provider.connection,
      buyer,
      currencyMint,
      buyer.publicKey
    );
    // mint to
    await mintTo(
      provider.connection,
      merchant,
      currencyMint,
      merchantAta,
      merchant,
      1_000_000
    );

    await mintTo(
      provider.connection,
      merchant,
      currencyMint,
      buyerAta,
      merchant,
      100_000_000
    );
  });

  it("Create product", async () => {
    const productId = "1234";
    const name = "IPhone 14";
    const description = "New Iphone 14";
    const images = ["https://google.com", "https://facebook.com"];
    const currencySymbol = "USDC";
    const currencyDecimals = 8;
    const price = new BN(100 * 10 ** currencyDecimals);
    const stock = new BN(1000);

    const [productPda, _] = await web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("products"),
        merchant.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(productId),
      ],
      program.programId
    );

    await program.methods
      .createProduct(
        productId,
        name,
        description,
        images,
        currencySymbol,
        currencyDecimals,
        price,
        stock
      )
      .accounts({
        product: productPda,
        merchant: merchant.publicKey,
        currencyMint,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([merchant])
      .rpc();

    const createdProduct = await program.account.product.fetch(productPda);

    assert.strictEqual(createdProduct.id, productId);
    assert.strictEqual(createdProduct.name, name);
    assert.strictEqual(createdProduct.description, description);
    assert.strictEqual(createdProduct.currencySymbol, currencySymbol);
    assert.strictEqual(
      createdProduct.currency.toBase58(),
      currencyMint.toBase58()
    );
    assert.strictEqual(
      createdProduct.merchant.toBase58(),
      merchant.publicKey.toBase58()
    );
    assert.strictEqual(createdProduct.price.toString(), price.toString());
  });

  // it("Update product", async () => {
  //   const productId = "1234";
  //   const name = "IPhone 14";
  //   const description = "New Iphone 14";
  //   const images = ["https://google.com", "https://facebook.com"];
  //   const currencySymbol = "USDC";
  //   const price = new BN(100 * 10 ** 6);

  //   const [productPda, _] = await web3.PublicKey.findProgramAddress(
  //     [
  //       anchor.utils.bytes.utf8.encode("products"),
  //       merchant.publicKey.toBuffer(),
  //       anchor.utils.bytes.utf8.encode(productId),
  //     ],
  //     program.programId
  //   );

  //   await program.methods
  //     .createProduct(
  //       productId,
  //       name,
  //       description,
  //       images,
  //       currencySymbol,
  //       price
  //     )
  //     .accounts({
  //       product: productPda,
  //       merchant: merchant.publicKey,
  //       currencyMint,
  //       systemProgram: web3.SystemProgram.programId,
  //     })
  //     .signers([merchant])
  //     .rpc();

  //   let createdProduct = await program.account.product.fetch(productPda);

  //   assert.strictEqual(createdProduct.id, productId);

  //   await program.methods
  //     .updateProduct("New name", null, null, null, null)
  //     .accounts({
  //       product: productPda,
  //       merchant: merchant.publicKey,
  //     })
  //     .signers([merchant])
  //     .rpc();

  //   createdProduct = await program.account.product.fetch(productPda);

  //   assert.strictEqual(createdProduct.name, "New name");
  // });

  it("Create payment link", async () => {
    const productId = "12345";
    const paymentLinkId = "12345";
    const price = 1 * 10 ** 6;

    const { productPda } = await createProduct(
      program,
      productId,
      currencyMint,
      price,
      merchant
    );
     
    const [paymentLinkPda, _] = await web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("payment_links"),
        merchant.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(paymentLinkId),
        anchor.utils.bytes.utf8.encode(productId),
      ],
      program.programId
    );

    try {
      await program.methods
        .createPaymentLink(paymentLinkId, true, true, true)
        .accounts({
          product: productPda,
          merchant: merchant.publicKey,
          currencyMint,
          merchantTokenAccount: merchantAta,
          paymentLink: paymentLinkPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([merchant])
        .rpc();
    } catch (error) {
      console.error(error)
    }

    const createdPaymentLink = await program.account.paymentLink.fetch(
      paymentLinkPda
    );

    assert.strictEqual(createdPaymentLink.id, paymentLinkId);
    assert.strictEqual(createdPaymentLink.phoneNumberRequired, true);
    assert.strictEqual(createdPaymentLink.shippingAddressRequired, true);
    assert.strictEqual(createdPaymentLink.adjustableQuantity, true);
  });

  it("Create payment", async () => {
    const productId = "12345";
    const price = 1 * 10 ** 6;

    const { productPda } = await createProduct(
      program,
      productId,
      currencyMint,
      price,
      merchant
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
      const paymentId = "123456";
      const amount = new BN(2 * 10 ** 6);
      const quantity = new BN(2);

      let buyerAccount = await getAccount(provider.connection, buyerAta);

      await program.methods
        .createPayment(paymentId, amount, quantity)
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

      buyerAccount = await getAccount(provider.connection, buyerAta);

    } catch (error) {
      console.error(error);
    }
  });

  it("Cancel payment", async () => {
    const productId = "12345";
    const price = 1 * 10 ** 6;
    const paymentId = "12345";
    const quantity = 2;
    const amount = price * quantity;

    const { productPda } = await createProduct(
      program,
      productId,
      currencyMint,
      price,
      merchant
    );
    console.log("product created");
    const { paymentPda, escrowPda } = await createPayment(
      program,
      paymentId,
      productId,
      amount,
      quantity,
      merchant,
      buyer,
      currencyMint,
      buyerAta,
      merchantAta
    );
    console.log("payment created");

    try {
      let buyerAccount = await getAccount(provider.connection, buyerAta);
      let escrowAccount = await getAccount(provider.connection, escrowPda);
      console.log("current buyer balance", buyerAccount.amount.toString());
      console.log("current escrow balance", escrowAccount.amount.toString());

      await program.methods
        .cancelPayment()
        .accounts({
          buyer: buyer.publicKey,
          product: productPda,
          currencyMint: currencyMint,
          buyerTokenAccount: buyerAta,
          merchantTokenAccount: merchantAta,
          payment: paymentPda,
          escrow: escrowPda,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([buyer])
        .rpc();

      // console.log("[Create payment]Your transaction signature", tx2);

      buyerAccount = await getAccount(provider.connection, buyerAta);
      escrowAccount = await getAccount(provider.connection, escrowPda);

      console.log("new buyer balance", buyerAccount.amount.toString());
      console.log("new escrow balance", escrowAccount.amount.toString());
    } catch (error) {
      console.error(error);
    }
  });

  it("Accept payment", async () => {
    const productId = "12345";
    const price = 1 * 10 ** 6;
    const paymentId = "12345";
    const quantity = 2;
    const amount = price * quantity;

    const { productPda } = await createProduct(
      program,
      productId,
      currencyMint,
      price,
      merchant
    );
    console.log("product created");
    const { paymentPda, escrowPda } = await createPayment(
      program,
      paymentId,
      productId,
      amount,
      quantity,
      merchant,
      buyer,
      currencyMint,
      buyerAta,
      merchantAta
    );
    console.log("payment created");

    try {
      let buyerAccount = await getAccount(provider.connection, buyerAta);
      let merchantAccount = await getAccount(provider.connection, merchantAta);
      let escrowAccount = await getAccount(provider.connection, escrowPda);
      console.log("current buyer balance", buyerAccount.amount.toString());
      console.log(
        "current merchant balance",
        merchantAccount.amount.toString()
      );
      console.log("current escrow balance", escrowAccount.amount.toString());

      await program.methods
        .acceptPayment()
        .accounts({
          buyer: buyer.publicKey,
          product: productPda,
          currencyMint: currencyMint,
          buyerTokenAccount: buyerAta,
          merchantTokenAccount: merchantAta,
          payment: paymentPda,
          escrow: escrowPda,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([buyer])
        .rpc();

      // console.log("[Create payment]Your transaction signature", tx2);

      buyerAccount = await getAccount(provider.connection, buyerAta);
      merchantAccount = await getAccount(provider.connection, merchantAta);
      escrowAccount = await getAccount(provider.connection, escrowPda);

      console.log("new buyer balance", buyerAccount.amount.toString());
      console.log("new escrow balance", escrowAccount.amount.toString());
      console.log("new merchant balance", merchantAccount.amount.toString());
    } catch (error) {
      console.error(error);
    }
  });
});
