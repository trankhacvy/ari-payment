import React, { useState } from "react";
import { GetStaticPropsContext } from "next";
import Card from "components/card/Card";
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Heading,
  Input,
  Text,
  useColorModeValue,
  HStack,
  Badge,
  useNumberInput,
  AspectRatio,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { database } from "libs/database";
import { PaymentLink } from "types/schema";
import { formatNumber } from "utils/number";
import Head from "next/head";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import CheckoutModal from "components/checkout-modal";
import { HSeparator } from "components/separator/Separator";

export default function CheckoutPage({
  paymentLink,
}: {
  paymentLink: PaymentLink;
}) {
  const { connected, publicKey } = useWallet();
  const textHeadingColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.500";
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const [success, setIsSuccess] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const product = paymentLink.hackathon_products;

  const thumbnail = product.images[selected];

  const onQuantityChange = (_: string, valueAsNumber: number) => {
    setQuantity(valueAsNumber);
  };

  return (
    <Container maxW="96em" p="10">
      <Head>
        <title>{product.name}</title>
      </Head>
      <Card p="10">
        {success ? (
          <SuccessSection
            paymentLink={paymentLink}
            quantity={quantity}
            onClick={() => setIsSuccess(false)}
          />
        ) : (
          <Flex
            w="full"
            flexDirection={{
              base: "column",
              lg: "row",
            }}
            gap="10"
          >
            <Box
              w={{
                base: "100%",
                lg: "md",
                xl: "xl",
                "2xl": "2xl",
              }}
            >
              <Box mb="5">
                <AspectRatio ratio={1 / 1}>
                  <Image
                    w="full"
                    src={thumbnail}
                    alt={product.name}
                    rounded="2xl"
                    bg="gray.200"
                  />
                </AspectRatio>
              </Box>
              <HStack
                gap={{
                  base: 4,
                  md: 8,
                }}
                justifyContent="center"
              >
                {product.images.map((img, index) => (
                  <Box
                    key={img}
                    w={{
                      base: 12,
                      md: 40,
                    }}
                    h={{
                      base: 12,
                      md: 40,
                    }}
                    rounded="2xl"
                    bg="gray.200"
                    overflow="hidden"
                    as="button"
                    onClick={() => setSelected(index)}
                  >
                    <Image w="full" h="full" src={img} alt={product.name} />
                  </Box>
                ))}
              </HStack>
            </Box>

            <Box flex={1} py="4">
              <Heading color={textHeadingColor} fontSize="3xl" mb="4">
                {product.name}
              </Heading>
              <Text color={textColorSecondary} mb="8">
                {product.description}
              </Text>
              <HStack mb="8">
                <Text color={textHeadingColor} fontWeight="bold" fontSize="3xl">
                  {formatNumber(product.display_price)}{" "}
                  {product.currency_symbol}
                </Text>
                <Badge colorScheme="green" size="lg">
                  In stock
                </Badge>
              </HStack>
              <Box mb="8">
                <Text mb="4" fontWeight="semibold" color={textHeadingColor}>
                  Quantity
                </Text>
                <NumberInput min={1} max={100} onChange={onQuantityChange} />
              </Box>
              <HSeparator mb="8" />
              <HStack mb="8" justifyContent="space-between">
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold">
                  {quantity * paymentLink.hackathon_products.display_price}{" "}
                  {paymentLink.hackathon_products.currency_symbol}
                </Text>
              </HStack>
              <HStack justifyContent="flex-end">
                {connected && publicKey ? (
                  <Button
                    onClick={onOpen}
                    size="lg"
                    maxW="160px"
                    variant="darkBrand"
                    alignSelf="flex-end"
                    w="full"
                  >
                    <Image mr="4" w="4" h="4" src="/sol.png" alt="solana" />
                    Checkout
                  </Button>
                ) : (
                  <WalletMultiButton />
                )}
              </HStack>
            </Box>
          </Flex>
        )}
      </Card>
      <CheckoutModal
        paymentLink={paymentLink}
        isOpen={isOpen}
        onClose={onClose}
        quantity={quantity}
        setIsSuccess={setIsSuccess}
      />
    </Container>
  );
}

interface NumberInputProps {
  min: number;
  max: number;
  onChange: (valueAsString: string, valueAsNumber: number) => void;
}

function NumberInput({ min, max, onChange }: NumberInputProps) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min,
      max,
      onChange,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack>
      <Button variant="brand" rounded="full" {...dec}>
        -
      </Button>
      <Input variant="auth" maxW="4rem" {...input} />
      <Button variant="brand" rounded="full" {...inc}>
        +
      </Button>
    </HStack>
  );
}

const SuccessSection = ({
  paymentLink,
  quantity,
  onClick,
}: {
  paymentLink: PaymentLink;
  quantity: number;
  onClick: VoidFunction;
}) => {
  const product = paymentLink.hackathon_products;

  const textHeadingColor = useColorModeValue("navy.700", "white");
  return (
    <VStack maxW="container.md" w="full" mx="auto" my="20" p="10" gap="6">
      <Box p="4" borderColor="green.500" borderWidth="4px" rounded="full">
        <CheckIcon w="6" h="6" color="green.500" />
      </Box>
      <Heading size="lg">Thanks for your payment</Heading>
      <HSeparator />
      <HStack w="full" justifyContent="space-between">
        <Text color={textHeadingColor}>{product.name}</Text>
        <Text color={textHeadingColor} fontWeight="bold">
          {quantity * product.display_price} {product.currency_symbol}
        </Text>
      </HStack>
      <HSeparator />
      <Button onClick={onClick} alignSelf="flex-end" variant="brand">
        Continue shop
      </Button>
    </VStack>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const linkId = context?.params?.linkId;

  if (!linkId) {
    return {
      notFound: true,
    };
  }

  try {
    const { data, error } = await database
      .from("hackathon_payment_links")
      .select("*,hackathon_products(*)")
      .eq("id", linkId)
      .single();

    if (error) throw error;

    const paymentLink = data as PaymentLink;

    return {
      props: { paymentLink },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
