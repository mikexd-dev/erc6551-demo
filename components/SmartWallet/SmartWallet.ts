import { ethers } from "ethers";
import { SmartWallet } from "@thirdweb-dev/wallets";
import {
  TWAPI_KEY,
  FACTORY_ADDRESS,
  activeChain,
  NFTDROP_ADDRESS,
  IMPLEMENTATION_ADDRESS,
} from "../../const/constants";
import { SmartContract, NFT } from "@thirdweb-dev/sdk";
import { WalletOptions } from "@thirdweb-dev/wallets";
import type { SmartWalletConfig } from "@thirdweb-dev/wallets";
import type { BaseContract } from "ethers";

export default function newSmartWallet(token: NFT) {
  // Smart Wallet config object
  const config: WalletOptions<SmartWalletConfig> = {
    chain: activeChain,
    factoryAddress: FACTORY_ADDRESS,
    thirdwebApiKey: TWAPI_KEY,
    gasless: true,
    factoryInfo: {
      createAccount: async (
        factory: SmartContract<BaseContract>,
        owner: string
      ) => {
        const account = factory.prepare("createAccount", [
          IMPLEMENTATION_ADDRESS,
          activeChain.chainId,
          NFTDROP_ADDRESS,
          token.metadata.id,
          0,
          ethers.utils.toUtf8Bytes(""),
        ]);
        console.log("here", account);
        return account;
      },
      getAccountAddress: async (
        factory: SmartContract<BaseContract>,
        owner: string
      ) => {
        return factory.call("account", [
          IMPLEMENTATION_ADDRESS,
          activeChain.chainId,
          NFTDROP_ADDRESS,
          token.metadata.id,
          0,
        ]);
      },
    },
  };
  return new SmartWallet(config);
}
