import type { GetServerSideProps } from "next";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import AdminLayout from "layouts/admin";
import { getUser } from "../auth.config";

export default function CustomersPage() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <AdminLayout title="Customer">
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Heading color={textColor} fontSize="3xl" fontWeight="700">
          Customers
        </Heading>
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
