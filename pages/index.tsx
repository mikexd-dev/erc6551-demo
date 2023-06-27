import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Main.module.css";
import { NFTDROP_ADDRESS } from "../const/constants";
import NFTGrid from "../components/NFT/NFTGrid";
import Container from "../components/Container/Container";
import Link from "next/link";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract } = useContract(NFTDROP_ADDRESS);

  const { data, isLoading } = useOwnedNFTs(contract, address);

  return (
    <Container maxWidth="lg">
      {address ? (
        <div className={styles.container}>
          <h1>ERC6551 Demo (Mumbai Testnet)</h1>
          <p style={{ width: "50%" }}>
            Browse the NFTs inside your personal wallet, select one to connect a
            token bound smart wallet & view it&apos;s balance.
          </p>
          <p style={{ width: "50%", fontSize: "10px", color: "#BBF7D0" }}>
            Note: First NFT claim requires a small amount of Matic to cover gas.
            You can get some <Link href="https://mumbaifaucet.com">here</Link>{" "}
            if you don&apos;t have any. Subsequent claims within the NFT Wallet
            are gasless.
          </p>
          <NFTGrid
            isLoading={isLoading}
            nfts={data}
            emptyText={"No NFTs found"}
          />
          <div className={styles.btnContainer}>
            <Web3Button
              contractAddress={NFTDROP_ADDRESS}
              action={(contract) => contract.erc721.claim(1)}
            >
              Claim NFT
            </Web3Button>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <h2>Connect a personal wallet to view your owned NFTs</h2>
          <ConnectWallet />
        </div>
      )}
    </Container>
  );
};

export default Home;
