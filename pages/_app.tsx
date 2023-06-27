import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  smartWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import {
  ACCOUNT_FACTORY_ADDRESS,
  TWAPI_KEY,
  activeChain,
} from "../const/constants";
import { Navbar } from "../components/Navbar/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        // smartWallet({
        //   factoryAddress: ACCOUNT_FACTORY_ADDRESS, // Address of your account factory smart contract
        //   thirdwebApiKey: TWAPI_KEY,
        //   gasless: true,
        //   // Local wallet as the only option for EOA
        //   personalWallets: [
        //     // metamaskWallet(),
        //     localWallet({
        //       persist: true,
        //     }),
        //   ],
        // }),
      ]}
    >
      <Navbar />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
