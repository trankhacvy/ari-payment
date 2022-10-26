/* eslint-disable */
import React, { useEffect, useMemo } from "react";
import {
  Column,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
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
  Tooltip,
  useColorModeValue,
  useClipboard,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, CopyIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { columnsDataPaymentLinks } from "views/admin/dataTables/variables/columnsData";
import { PaymentLink } from "types/schema";
import dayjs from "dayjs";
import { formatNumber } from "utils/number";

interface PaymentLinksTableProps {
  isLoading: boolean;
  links?: PaymentLink[];
}

export default function PaymentLinksTable(props: PaymentLinksTableProps) {
  const { isLoading, links = [] } = props;

  const columns = useMemo(
    () => columnsDataPaymentLinks as Column[],
    [columnsDataPaymentLinks]
  );

  const { hasCopied, onCopy, setValue } = useClipboard("");

  const data = useMemo(() => links, [JSON.stringify(links)]);

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

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const searchIconColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="24px" justify="space-between" mb="20px" align="center">
        <Heading color={textColor} fontSize="3xl" fontWeight="700">
          Payment Links
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
              placeholder="Search payment links..."
              fontWeight="500"
            />
          </InputGroup>
          <Select
            id="type"
            w="unset"
            variant="auth"
            display="flex"
            alignItems="center"
            defaultValue="active"
            minW="8rem"
          >
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </Select>
          <Link href="/payment-links/new" passHref>
            <Button
              as="a"
              leftIcon={<AddIcon w="16px" h="16px" />}
              variant="brand"
              minW="6rem"
            >
              Add
            </Button>
          </Link>
        </HStack>
      </Flex>
      {isLoading ? (
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
            {page.map((row) => {
              prepareRow(row);
              return (
                // @ts-ignore
                <Tr {...row.getRowProps()} key={row.original.id}>
                  {row.cells.map((cell, index) => {
                    let data;
                    if (cell.column.Header === "URL") {
                      data = <CopiableLink value={cell.value} />;
                    } else if (cell.column.Header === "Status") {
                      data = (
                        <Badge colorScheme="green">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            Active
                          </Text>
                        </Badge>
                      );
                    } else if (cell.column.Header === "Name") {
                      const item = cell.row.original as PaymentLink;
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {item.hackathon_products.name}
                        </Text>
                      );
                    } else if (cell.column.Header === "Price") {
                      const item = cell.row.original as PaymentLink;
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {formatNumber(item.hackathon_products.display_price)}{" "}
                          {item.hackathon_products.currency_symbol}
                        </Text>
                      );
                    } else if (cell.column.Header === "Created") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {dayjs(cell.value).format("DD MMM YYYY, HH:MM")}
                        </Text>
                      );
                    } else if (cell.column.Header === "Action") {
                      data = (
                        <Flex w="full" gap={4}>
                          <Button variant="brand">Delivery</Button>
                          <Button variant="action">Refund</Button>
                        </Flex>
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
    </Card>
  );
}

const CopiableLink = ({ value }: { value: string }) => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { hasCopied, onCopy } = useClipboard(
    `${process.env.NEXT_PUBLIC_CHECKOUT_DOMAIN!}/${value}`
  );

  return (
    <HStack>
      <Badge colorScheme="brand">
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {value}
        </Text>
      </Badge>
      <Tooltip
        closeDelay={300}
        label={hasCopied ? "Copied" : "Copy to clipboard"}
      >
        <IconButton
          aria-label="Copy Link"
          icon={<CopyIcon />}
          onClick={onCopy}
        />
      </Tooltip>
    </HStack>
  );
};

const TableSkeleton = () => (
  <Box px="6">
    <Skeleton mb="4" h="6" w="80%" />
    <Skeleton mb="4" h="6" w="70%" />
    <Skeleton mb="4" h="6" w="90%" />
  </Box>
);
