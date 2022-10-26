/* eslint-disable */
import {
  Box,
  Skeleton,
  Badge,
  Button,
  Heading,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
// Custom components
import Card from "components/card/Card";
import React, { useMemo, useState } from "react";
import {
  Column,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { ColumnData } from "views/admin/default/variables/columnsData";
import { Order } from "types/schema";
import truncate from "utils/truncate";
import { useWallet } from "@solana/wallet-adapter-react";
import { Solana } from "libs/solana";
import { database } from "libs/database";
import { useOrders } from "hooks/useOrders";

export type TablePaymentData = Column<Order>;

interface IColumnHeader {
  Header: string;
  accessor?: string;
}

export const columnsDataPayments: IColumnHeader[] = [
  {
    Header: "Product",
    accessor: "hackathon_payment_links",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Customer",
    accessor: "customer",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

interface TransactionsTableProps {
  columnsData: ColumnData;
  tableData: TablePaymentData[];
  loading: boolean;
}

export default function TransactionsTable(props: TransactionsTableProps) {
  const { loading, columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;

  initialState.pageSize = 10;

  const textBrandColor = useColorModeValue("brand.500", "brand.400");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const searchIconColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const {
    isOpen: isOpenDeliver,
    onOpen: onOpenDeliver,
    onClose: onCloseDeliver,
  } = useDisclosure();

  const {
    isOpen: isOpenRefund,
    onOpen: onOpenRefund,
    onClose: onCloseRefund,
  } = useDisclosure();
  const [order, setOrder] = useState<Order | null>(null);

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="24px" justify="space-between" mb="20px" align="center">
        <Heading color={textColor} fontSize="3xl" fontWeight="700">
          Orders
        </Heading>
        <HStack>
          <InputGroup>
            <InputLeftElement>
              <IconButton
                aria-label="search"
                bg="inherit"
                borderRadius="inherit"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
                icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
              />
            </InputLeftElement>
            <Input
              variant="auth"
              fontSize="sm"
              ms={{ base: "0px", md: "0px" }}
              placeholder="Search order..."
              fontWeight="500"
            />
          </InputGroup>
          <Select
            id="type"
            w="unset"
            variant="auth"
            display="flex"
            alignItems="center"
            defaultValue="new"
            minW="8rem"
          >
            <option value="new">New</option>
            <option value="delivered">Delivered</option>
            <option value="refunded">Refunded</option>
          </Select>
        </HStack>
      </Flex>
      {loading ? (
        <TableSkeleton />
      ) : (
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                // @ts-ignore
                <Tr {...row.getRowProps()} key={row.original.id}>
                  {row.cells.map((cell, index) => {
                    let data;
                    const order = cell.row.original as Order;
                    const product =
                      order.hackathon_payment_links.hackathon_products;

                    let status = "New";
                    let colorScheme = "blue";
                    if (order.delivered) {
                      status = "Delivered";
                      colorScheme = "green";
                    } else if (order.cancelled) {
                      status = "Cancelled";
                      colorScheme = "gray";
                    } else if (order.refunded) {
                      status = "Refunded";
                      colorScheme = "red";
                    }

                    if (cell.column.Header === "Product") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {product.name}
                        </Text>
                      );
                    } else if (cell.column.Header === "Status") {
                      data = (
                        <Badge colorScheme={colorScheme}>
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {status}
                          </Text>
                        </Badge>
                      );
                    } else if (cell.column.Header === "Customer") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {truncate(cell.value, 8, true)}
                        </Text>
                      );
                    } else if (cell.column.Header === "Quantity") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Amount") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value / 10 ** product.currency_decimals}{" "}
                          {product.currency_symbol}
                        </Text>
                      );
                    } else if (cell.column.Header === "Action") {
                      data = (
                        <HStack w="full" gap="4">
                          {status === "New" && (
                            <Button
                              onClick={() => {
                                setOrder(order);
                                onOpenDeliver();
                              }}
                              variant="link"
                              color={textBrandColor}
                              textDecoration="underline"
                            >
                              Deliver
                            </Button>
                          )}
                          {status === "New" && (
                            <Button
                              onClick={() => {
                                setOrder(order);
                                onOpenRefund();
                              }}
                              variant="link"
                              color={textBrandColor}
                              textDecoration="underline"
                            >
                              Refund
                            </Button>
                          )}
                        </HStack>
                      );
                    }

                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
      {order && (
        <ConfirmDeliverModal
          isOpen={isOpenDeliver}
          onClose={onCloseDeliver}
          order={order}
          setOrder={setOrder}
        />
      )}
      {order && (
        <ConfirmRefundModal
          isOpen={isOpenRefund}
          onClose={onCloseRefund}
          order={order}
          setOrder={setOrder}
        />
      )}
    </Card>
  );
}

const TableSkeleton = () => (
  <Box px="6">
    <Skeleton mb="4" h="6" w="80%" />
    <Skeleton mb="4" h="6" w="70%" />
    <Skeleton mb="4" h="6" w="90%" />
  </Box>
);

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  order: Order;
  setOrder: (order: Order | null) => void;
}

const ConfirmDeliverModal = ({
  isOpen,
  onClose,
  order,
  setOrder,
}: ConfirmModalProps) => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const toast = useToast({ position: "top" });
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();
  const { mutate } = useOrders()

  const handleDelivery = async () => {
    try {
      if (!publicKey) return;
      const program = new Solana();
      setLoading(true);
      await program.deliverOrder(order, publicKey);

      const { error } = await database
        .from("hackathon_orders")
        .update({ delivered: true })
        .eq("id", order.id);

      if (error) throw error;

      toast({
        title: "Order successfully delivered",
        status: "success",
      });
      setLoading(false);
      setOrder(null);
      mutate();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      toast({
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm action</ModalHeader>
        <ModalCloseButton />
        <ModalBody color={textColor}>
          Are you sure deliver this order?
        </ModalBody>

        <ModalFooter>
          <Button variant="lightBrand" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button isLoading={loading} onClick={handleDelivery} variant="brand">
            Deliver
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ConfirmRefundModal = ({
  isOpen,
  onClose,
  order,
  setOrder,
}: ConfirmModalProps) => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const toast = useToast({ position: "top" });
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();
  const { mutate } = useOrders()

  const handleRefund = async () => {
    try {
      if (!publicKey) return;

      setLoading(true);
      const program = new Solana();

      await program.refund(order, publicKey);

      const { error } = await database
        .from("hackathon_orders")
        .update({ refunded: true })
        .eq("id", order.id);

      if (error) throw error;

      toast({
        title: "Order successfully refunded",
        status: "success",
      });
      setLoading(false);
      setOrder(null);
      mutate()
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      toast({
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm action</ModalHeader>
        <ModalCloseButton />
        <ModalBody color={textColor}>Are you sure refund this order?</ModalBody>

        <ModalFooter>
          <Button variant="lightBrand" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button isLoading={loading} onClick={handleRefund} variant="brand">
            Refund
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
