interface IColumnHeader {
  Header: string;
  accessor?: string;
}

type Columns = IColumnHeader[];

export const columnsDataDevelopment: Columns = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "TECH",
    accessor: "tech",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
];

export const columnsDataTransactions: Columns = [
  {
    Header: "Product",
    accessor: "product",
  },
  {
    Header: "Status",
    accessor: "status",
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

export const columnsDataCheck: Columns = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];

export const columnsDataColumns: Columns = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];

export const columnsDataComplex: Columns = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "STATUS",
    accessor: "status",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
];

export const columnsDataPaymentLinks: Columns = [
  {
    Header: "URL",
    accessor: "id",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Name",
  },
  {
    Header: "Price",
  },
  {
    Header: "Created",
    accessor: 'createdAt'
  }
];
