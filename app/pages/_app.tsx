import { ChakraProvider } from "@chakra-ui/react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import type { AppProps } from "next/app";
import theme from "theme/theme";

require("@solana/wallet-adapter-react-ui/styles.css");
import "styles/Fonts.css";
import "styles/App.css";
import "styles/Contact.css";
import "styles/MiniCalendar.css";

const network: Network = process.env.NEXT_PUBLIC_NETWORK!;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ThirdwebProvider
        network={network}
        authConfig={{
          domain: process.env.NEXT_PUBLIC_DOMAIN!,
          authUrl: "/api/auth",
          loginRedirect: "/",
        }}
      >
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
