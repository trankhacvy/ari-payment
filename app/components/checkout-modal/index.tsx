import React from "react";
import { nanoid } from "nanoid";
import { database } from "libs/database";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Button,
  Box,
  FormLabel,
  Input,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Order, PaymentLink } from "types/schema";
import { HSeparator } from "components/separator/Separator";
import { useForm } from "react-hook-form";
import { Solana } from "libs/solana";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  paymentLink: PaymentLink;
  quantity: number;
  setIsSuccess: (success: boolean) => void;
}

type CheckoutFormFields = {
  email: string;
  name?: string;
  phone_number?: string;
  state?: string;
  city?: string;
  address?: string;
};

export default function CheckoutModal(props: CheckoutModalProps) {
  const { isOpen, onClose, paymentLink, quantity, setIsSuccess } = props;
  const toast = useToast({ position: "top" });
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CheckoutFormFields>();

  const onSubmit = async (data: CheckoutFormFields) => {
    try {
      if (!publicKey) return;

      let buyerAta = await getAssociatedTokenAddress(
        new PublicKey(paymentLink.currency),
        publicKey
      );

      const params: Omit<Order, "created_at" | "hackathon_payment_links"> = {
        id: nanoid(),
        product_id: paymentLink.product_id,
        payment_link_id: paymentLink.id,
        merchant: paymentLink.merchant,
        merchant_token_account: paymentLink.merchant_token_account,
        customer: publicKey.toBase58(),
        customer_token_account: buyerAta.toBase58(),
        amount: quantity * paymentLink.hackathon_products.price,
        display_amount: quantity * paymentLink.hackathon_products.display_price,
        quantity,
        delivered: false,
        cancelled: false,
        refunded: false,
        customer_info: data,
      };

      const { data: createdOrder, error } = await database
        .from("hackathon_orders")
        .insert(params)
        .select("*,hackathon_payment_links(*,hackathon_products(*))")
        .single();

      if (error) throw error;

      if (!createdOrder) {
        throw new Error("Unknown error");
      }

      const program = new Solana();
      await program.createOrder(createdOrder as Order, publicKey, connection);

      onClose();

      toast({
        title: "Congratulation",
        description: "Your order has been placed.",
        status: "success",
      });
      reset();
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      toast({
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalContent>
          <ModalHeader>Checkout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Enter your email"
                fontWeight="500"
                size="lg"
                {...register("email")}
              />
            </Box>
            <Box mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Name
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Enter your name"
                fontWeight="500"
                size="lg"
                {...register("name")}
              />
            </Box>
            {paymentLink.phone_number_required && (
              <Box mb="24px">
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Phone number
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  placeholder="Enter your phone number"
                  fontWeight="500"
                  size="lg"
                  {...register("phone_number")}
                />
              </Box>
            )}
            {paymentLink.shipping_address_required && (
              <>
                <Box mb="24px">
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    State
                    <Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    placeholder="Enter your state"
                    fontWeight="500"
                    size="lg"
                    {...register("state")}
                  />
                </Box>
                <Box mb="24px">
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    City
                    <Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    placeholder="Enter your city"
                    fontWeight="500"
                    size="lg"
                    {...register("city")}
                  />
                </Box>
                <Box mb="24px">
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Address
                    <Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    placeholder="Enter your address"
                    fontWeight="500"
                    size="lg"
                    {...register("address")}
                  />
                </Box>
              </>
            )}
            <HSeparator />
            <HStack py="24px" justifyContent="space-between">
              <Text fontWeight="bold">Total</Text>
              <Text fontWeight="bold">
                {quantity * paymentLink.hackathon_products.display_price}{" "}
                {paymentLink.hackathon_products.currency_symbol}
              </Text>
            </HStack>
            <HSeparator />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" isLoading={isSubmitting}>
              Checkout
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
