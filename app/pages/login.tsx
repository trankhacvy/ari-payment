import React, { useEffect } from "react";
import type { GetServerSideProps } from "next";
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import DefaultAuthLayout from "layouts/auth/Default";
import { useLogin, useUser } from "@thirdweb-dev/react/solana";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { getUser } from "../auth.config";
import { useWallet } from "@solana/wallet-adapter-react";

export default function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";

  const { connected, connecting } = useWallet();
  const { user } = useUser();
  const login = useLogin();

  useEffect(() => {
    if (connected && !user?.address) {
      setTimeout(() => {
        login();
      }, 200);
    }
  }, [connected, connecting, user?.address]);

  return (
    <DefaultAuthLayout illustrationBackground={"/img/payment.jpg"}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Welcome to ARI,
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Connect wallet to sign in!
          </Text>
        </Box>
        <WalletMultiButton />
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          {/* <Button
            fontSize="sm"
            me="0px"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            bgColor={googleBg}
            color={googleText}
            fontWeight="500"
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
            onClick={() => login()}
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Connect wallet
          </Button> */}
        </Flex>
      </Flex>
    </DefaultAuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUser(req);

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
