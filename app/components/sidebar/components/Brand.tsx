import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex alignItems="center" flexDirection="column">
      <Heading color={logoColor} my="32px">
        ARI
      </Heading>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
