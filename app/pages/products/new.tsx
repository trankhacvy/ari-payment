import type { GetServerSideProps } from "next";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Textarea,
  Text,
  Select,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  useToast,
} from "@chakra-ui/react";
import { MdUpload } from "react-icons/md";
import Card from "components/card/Card";
import Dropzone from "views/admin/profile/components/Dropzone";
import AdminLayout from "layouts/admin";
import { Product } from "types/schema";
import { Storage } from "libs/storage";
import { database } from "libs/database";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { Solana } from "libs/solana";
import Head from "next/head";
import { getUser } from "../../auth.config";

type ProductFormFields = Omit<Product, "id" | "created_at">;

const currencies = [
  {
    symbol: "USDC-Dev",
    decimals: 6,
    address: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  },
  {
    symbol: "USDC",
    decimals: 6,
    address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  },
];

export default function NewProductPage() {
  const toast = useToast({ position: "top" });
  const [files, setFiles] = useState<File[]>([]);
  const { publicKey } = useWallet();
  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProductFormFields>();

  const onSubmit = async (data: ProductFormFields) => {
    try {
      if (!publicKey) return;

      const program = new Solana();
      const storage = new Storage();
      const uploadedFiles = await storage.uploadFiles(
        files,
        publicKey.toBase58()
      );
      const currency = currencies.find(
        (currency) => currency.address === data.currency
      );
      if (!currency) return;

      const { data: createdProducts, error } = await database
        .from("hackathon_products")
        .insert({
          ...data,
          id: nanoid(),
          merchant: publicKey.toBase58(),
          images: uploadedFiles,
          currency: currency?.address,
          currency_symbol: currency?.symbol,
          currency_decimals: currency?.decimals,
          price: data.price * 10 ** currency.decimals,
          display_price: data.price,
        })
        .select("*");

      if (error) throw error;

      if (
        !createdProducts ||
        !Array.isArray(createdProducts) ||
        (createdProducts as Product[]).length === 0
      ) {
        throw new Error("Unknown error");
      }
      const createdProduct = createdProducts[0] as Product;
      await program.createProduct(createdProduct, publicKey);

      toast({
        title: "Product created.",
        status: "success",
      });

      replace("/products");
    } catch (error: any) {
      console.error(error);
      toast({
        description: error.message,
        status: "error",
      });
    }
  };

  const handleFilesChange = (files: File[]) => {
    setFiles(files);
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const brandColor = useColorModeValue("brand.500", "white");

  return (
    <AdminLayout brandText="New Product">
      <Head>
        <title>New product</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
          <Container as={Card} maxW="container.md">
            <Text mb="20px" color={textColor} fontSize="2xl" fontWeight="700">
              New product
            </Text>
            <FormControl>
              <Box mb="24px">
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Product title
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  placeholder="IPhone 14 Pro"
                  fontWeight="500"
                  size="lg"
                  {...register("name")}
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
                  Description
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <Textarea
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  placeholder="IPhone 14 Pro"
                  fontWeight="500"
                  size="lg"
                  rows={10}
                  {...register("description")}
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
                  Images
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <Dropzone
                  content={
                    <Box py="20px">
                      <Icon
                        as={MdUpload}
                        w="80px"
                        h="80px"
                        color={brandColor}
                      />
                      <Flex justify="center" mx="auto" mb="12px">
                        <Text fontSize="xl" fontWeight="700" color={brandColor}>
                          Upload Files
                        </Text>
                      </Flex>
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color="secondaryGray.500"
                      >
                        PNG, JPG and GIF files are allowed
                      </Text>
                    </Box>
                  }
                  onChange={handleFilesChange}
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
                  Currency
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <Select
                  w="100%"
                  variant="auth"
                  display="flex"
                  alignItems="center"
                  defaultValue={currencies[0].address}
                  {...register("currency")}
                >
                  {currencies.map((currency) => (
                    <option key={currency.address} value={currency.address}>
                      {currency.symbol}
                    </option>
                  ))}
                </Select>
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
                  Price
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <NumberInput variant="auth" max={1000} min={0}>
                  <NumberInputField {...register("price")} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
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
                  Stock
                  <Text color={brandStars}>*</Text>
                </FormLabel>
                <NumberInput variant="auth" max={1000} min={0}>
                  <NumberInputField {...register("stock")} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
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
            </FormControl>
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
