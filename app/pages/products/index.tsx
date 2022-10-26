import type { GetServerSideProps } from "next";
import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Product, { ProductSkeleton } from "components/card/Product";
import AdminLayout from "layouts/admin";
import { useGetProducts } from "hooks/useProducts";
import Link from "next/link";
import Head from "next/head";
import { getUser } from "../../auth.config";

export default function ProductsPage() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { products, isFirstLoading } = useGetProducts();

  return (
    <AdminLayout title="Products" brandText="Products" secondary={false}>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <HStack alignItems="center" justifyContent="space-between" mb="24px">
          <Text color={textColor} fontSize="3xl" fontWeight="700">
            Products
          </Text>
          <Link href="/products/new" passHref>
            <Button size="lg" leftIcon={<AddIcon />} as="a" variant="brand">
              Add
            </Button>
          </Link>
        </HStack>
        {isFirstLoading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
            {Array.from({ length: 9 }).map((_, idx) => (
              <ProductSkeleton key={`item-${idx}`} />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
            {(products ?? []).map((product) => (
              <Product
                key={product.id}
                name={product.name}
                image={product.images[0]}
                price={product.display_price}
                currencySymbol={product.currency_symbol}
                createdAt={product.created_at}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
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
