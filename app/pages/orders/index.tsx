import type { GetServerSideProps } from "next";
import { Box } from "@chakra-ui/react";
import AdminLayout from "layouts/admin";
import TransactionsTable, {
  TablePaymentData,
  columnsDataPayments,
} from "views/admin/dataTables/components/Transactions";
import { getUser } from "../../auth.config";
import { useOrders } from "hooks/useOrders";

export default function OrdersPage() {
  const { isFirstLoading, orders = [] } = useOrders();
  return (
    <AdminLayout title="Orders">
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <TransactionsTable
          loading={isFirstLoading}
          columnsData={columnsDataPayments}
          tableData={orders as unknown as TablePaymentData[]}
        />
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
