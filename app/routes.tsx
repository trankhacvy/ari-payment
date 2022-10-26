import { Icon } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import {
  MdPerson,
  MdHome,
  MdOutlineShoppingCart,
  MdCreditCard,
} from "react-icons/md";
import { IRoute } from "types/navigation";

const routes: IRoute[] = [
  {
    name: "Home",
    layout: "/admin",
    path: "/",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "/products",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
  },
  {
    name: "Payment Links",
    layout: "/admin",
    path: "/payment-links",
    icon: <Icon as={LinkIcon} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "/orders",
    icon: <Icon as={MdCreditCard} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Customer",
    layout: "/admin",
    path: "/customers",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;
