import type { GetServerSideProps } from "next";
import { Box } from "@chakra-ui/react";
import { useGetPaymentLinks } from "hooks/usePaymentLinks";
import AdminLayout from "layouts/admin";
import PaymentLinksTable from "views/admin/dataTables/components/PaymentLinksTable";
import { getUser } from "../../auth.config";
import Head from "next/head";

export default function PaymentLinksPage() {
  const { isFirstLoading, paymentLinks } = useGetPaymentLinks();

  return (
    <AdminLayout title="Payment Links">
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <PaymentLinksTable links={paymentLinks} isLoading={isFirstLoading} />
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
