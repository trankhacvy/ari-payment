import type { GetServerSideProps } from "next";
import { nanoid } from "nanoid";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Text,
  Select,
  useColorModeValue,
  useToast,
  Switch,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import AdminLayout from "layouts/admin";
import { PaymentLink } from "types/schema";
import { database } from "libs/database";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useGetProducts } from "hooks/useProducts";
import { Solana } from "libs/solana";
import { getUser } from "../../auth.config";
import { formatNumber } from "utils/number";
import { useEffect } from "react";

type PaymentLinkFormFields = Omit<
  PaymentLink,
  "id" | "created_at" | "merchant" | "merchant_token_account"
>;

export default function NewPaymentLinksPage() {
  const toast = useToast({ position: "top" });
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { replace } = useRouter();

  const { products = [] } = useGetProducts();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<PaymentLinkFormFields>();

  const onSubmit = async (data: PaymentLinkFormFields) => {
    try {
      if (!publicKey) return;
      const program = new Solana();

      const product = products.find(
        (product) => product.id === data.product_id
      );
      if (!product) return;

      const currencyMint = new PublicKey(product.currency);

      const merchantAta = await getAssociatedTokenAddress(
        currencyMint,
        publicKey
      );

      const { data: createdPaymentLink, error } = await database
        .from("hackathon_payment_links")
        .insert({
          id: nanoid(),
          product_id: data.product_id,
          merchant: publicKey.toBase58(),
          merchant_token_account: merchantAta.toBase58(),
          phone_number_required: data.phone_number_required,
          shipping_address_required: data.shipping_address_required,
          adjustable_quantity: data.adjustable_quantity,
          currency: product.currency,
          currency_symbol: product.currency_symbol,
          currency_decimals: product.currency_decimals,
        })
        .select("*,hackathon_products(*)")
        .single();

      if (error) throw error;

      if (!createdPaymentLink) {
        throw new Error("Unknown error");
      }

      await program.createPaymentLink(
        createdPaymentLink as PaymentLink,
        publicKey,
        connection
      );

      toast({
        title: "Payment Link Created.",
        status: "success",
      });

      replace("/payment-links");
    } catch (error: any) {
      console.error(error);
      toast({
        description: error.message,
        status: "error",
      });
    }
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  useEffect(() => {
    if (products.length > 0) {
      setValue("product_id", products[0].id);
    }
  }, [products]);

  return (
    <AdminLayout title="New Payment Links" brandText="New Payment Links">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
          <Container as={Card} maxW="container.md">
            <Text mb="20px" color={textColor} fontSize="2xl" fontWeight="700">
              New Payment Links
            </Text>

            <FormControl mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Product
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                w="100%"
                variant="auth"
                display="flex"
                alignItems="center"
                {...register("product_id")}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatNumber(product.display_price)}{" "}
                    {product.currency_symbol}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Box mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="16px"
              >
                Options
              </FormLabel>
              <FormControl
                ms="4px"
                mb="16px"
                display="flex"
                alignItems="center"
              >
                <FormLabel
                  htmlFor="phoneNumberRequired"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="0"
                >
                  Required phone number
                </FormLabel>
                <Switch
                  id="phoneNumberRequired"
                  {...register("phone_number_required")}
                />
              </FormControl>

              <FormControl
                ms="4px"
                mb="16px"
                display="flex"
                alignItems="center"
              >
                <FormLabel
                  htmlFor="shippingAddressRequired"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="0"
                >
                  Required shipping address
                </FormLabel>
                <Switch
                  id="shippingAddressRequired"
                  {...register("shipping_address_required")}
                />
              </FormControl>

              <FormControl
                ms="4px"
                mb="16px"
                display="flex"
                alignItems="center"
              >
                <FormLabel
                  htmlFor="adjustableQuantity"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="0"
                >
                  Let's customer adjust quantity
                </FormLabel>
                <Switch
                  id="adjustableQuantity"
                  {...register("adjustable_quantity")}
                />
              </FormControl>
            </Box>

            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="full"
              h="50"
              mb="24px"
              type="submit"
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </Container>
        </Box>
      </form>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUser(req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
