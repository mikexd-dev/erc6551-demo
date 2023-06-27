import {
  ThirdwebSDKProvider,
  Web3Button,
  useAddress,
  useBalance,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import {
  EDITIONDROP_ADDRESS,
  TOKENDROP_ADDRESS,
  activeChain,
} from "../../const/constants";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
import style from "../../styles/Token.module.css";
import NFTGrid from "../NFT/NFTGrid";
import NFTComponent from "../NFT/NFT";
import Link from "next/link";

interface ConnectedProps {
  signer: Signer | undefined;
}

// / ThirdwebSDKProvider is a wrapper component that provides the smart wallet signer and active chain to the Thirdweb SDK.
const SmartWalletConnected: React.FC<ConnectedProps> = ({ signer }) => {
  return (
    <ThirdwebSDKProvider signer={signer} activeChain={activeChain}>
      <ClaimTokens />
    </ThirdwebSDKProvider>
  );
};

// This is the main component that shows the user's token bound smart wallet
const ClaimTokens = () => {
  const address = useAddress();
  const { data: tokenBalance, isLoading: loadingBalance } =
    useBalance(TOKENDROP_ADDRESS);

  const { contract } = useContract(EDITIONDROP_ADDRESS);

  const { data: petNFTOwned, isLoading: nftLoading } = useOwnedNFTs(
    contract,
    address
  );

  console.log(petNFTOwned);

  return (
    <div className={style.walletContainer}>
      <h2> This is your Token Bound Smart Wallet! </h2>
      <Link
        href={`https://mumbai.polygonscan.com/address/${address}`}
        target="_blank"
      >
        <div style={{ fontSize: "12px" }}>{address}</div>
      </Link>

      {address ? (
        loadingBalance ? (
          <h2>Loading Balance...</h2>
        ) : (
          <div className={style.pricingContainer}>
            <h2>Balance: {tokenBalance?.displayValue}</h2>
            <Web3Button
              contractAddress={TOKENDROP_ADDRESS}
              action={async (contract) => await contract.erc20.claim(10)}
              onSuccess={() => {
                toast(`Token Claimed`, {
                  icon: "✅",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
              onError={(e) => {
                console.log(e);
                toast(`Token Claim Failed! Reason: ${(e as any).reason}`, {
                  icon: "❌",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
            >
              Claim 10 Tokens
            </Web3Button>
          </div>
        )
      ) : null}

      {address ? (
        loadingBalance ? (
          <h2>Checking Balance to claim Pet</h2>
        ) : (
          <div className={style.pricingContainer}>
            {nftLoading ? (
              <h2>Loading NFTs...</h2>
            ) : (
              petNFTOwned?.length > 0 && (
                <>
                  <h2>My Pets</h2>
                  <NFTComponent nft={petNFTOwned[0]} />
                </>
              )
            )}

            <h3>10 Token for 1 Pet</h3>
            <Web3Button
              contractAddress={EDITIONDROP_ADDRESS}
              action={async (contract) => await contract.erc1155.claim(0, 1)}
              onSuccess={() => {
                toast(`NFT Claimed`, {
                  icon: "✅",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
              onError={(e) => {
                console.log(e);
                toast(`NFT Claim Failed! Reason: ${(e as any).reason}`, {
                  icon: "❌",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
            >
              Claim Pet NFT
            </Web3Button>
          </div>
        )
      ) : null}
    </div>
  );
};

export default SmartWalletConnected;
