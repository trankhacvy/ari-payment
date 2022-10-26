import dayjs from "dayjs";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  Skeleton,
  useColorModeValue,
  AspectRatio,
  Badge,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { Image } from "components/image/Image";
// Assets
import { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { formatNumber } from "utils/number";

interface ProductProps {
  image: string;
  name: string;
  price: number;
  currencySymbol: string;
  createdAt: string;
}

export default function Product(props: ProductProps) {
  const { image, name, price, createdAt, currencySymbol } = props;
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");

  return (
    <Card p="5">
      <Flex direction={{ base: "column" }} justify="center">
        <Box mb={{ base: "20px", "2xl": "20px" }} position="relative">
          <AspectRatio
            alignContent="flex-end"
            alignItems="flex-start"
            alignSelf="flex-end"
            verticalAlign="bottom"
            bg="gray.200"
            ratio={1 / 1}
            borderRadius="20px"
          >
            <Image src={image} w={"100%"} borderRadius="20px" alt={name} />
          </AspectRatio>
          <Button
            position="absolute"
            bg="white"
            _hover={{ bg: "whiteAlpha.900" }}
            _active={{ bg: "white" }}
            _focus={{ bg: "white" }}
            p="0px !important"
            top="14px"
            right="14px"
            borderRadius="50%"
            minW="36px"
            h="36px"
            onClick={() => {
              setLike(!like);
            }}
          >
            <Icon
              transition="0.2s linear"
              w="20px"
              h="20px"
              as={like ? IoHeart : IoHeartOutline}
              color="brand.500"
            />
          </Button>
        </Box>
        <Flex flexDirection="column" alignItems="flex-start" w="full" h="100%">
          <Flex
            w="full"
            justifyContent="space-between"
            alignItems="center"
            // direction={{
            //   base: "row",
            //   md: "column",
            //   lg: "row",
            //   xl: "column",
            //   "2xl": "row",
            // }}
          >
            <Box>
              <Text
                color={textColor}
                fontSize={{
                  base: "xl",
                  md: "lg",
                  lg: "lg",
                  xl: "lg",
                  "2xl": "md",
                  "3xl": "lg",
                }}
                mb="5px"
                fontWeight="bold"
                me="14px"
              >
                {name}
              </Text>
              <Text
                color="secondaryGray.600"
                fontSize={{
                  base: "sm",
                }}
                fontWeight="400"
                me="14px"
              >
                {dayjs(createdAt).format("h:mm A")}
              </Text>
            </Box>
            <Badge size="lg" fontWeight="700" fontSize="sm" colorScheme="green">
              {formatNumber(price)} {currencySymbol}
            </Badge>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export const ProductSkeleton = () => {
  return (
    <Card p="5">
      <Box mb={{ base: "5", "2xl": "5" }} position="relative">
        <AspectRatio as={Skeleton} ratio={7 / 5} borderRadius="2xl">
          <div />
        </AspectRatio>
      </Box>
      <Box>
        <Skeleton w="50%" h="5" mb="2" />
        <Skeleton w="70%" h="5" />
      </Box>
    </Card>
  );
};
