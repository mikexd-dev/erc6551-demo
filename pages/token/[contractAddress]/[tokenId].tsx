import { GetStaticProps } from "next";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NFTDROP_ADDRESS, activeChain } from "../../../const/constants";
import { useEffect, useState } from "react";
import { Signer } from "ethers";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  useAddress,
  useWallet,
} from "@thirdweb-dev/react";
import newSmartWallet from "../../../components/SmartWallet/SmartWallet";
import { Toaster } from "react-hot-toast";
import Container from "../../../components/Container/Container";
import styles from "../../../styles/Token.module.css";
import SmartWalletConnected from "../../../components/SmartWallet/smartConnected";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

export default function Token({ nft, contractMetadata }: Props) {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );
  const [signer, setSigner] = useState<Signer>();

  // get the currently connected wallet
  const address = useAddress();
  const wallet = useWallet();

  // create a smart wallet for the NFT
  useEffect(() => {
    const createSmartWallet = async (nft: NFT) => {
      if (nft && smartWalletAddress == null && address && wallet) {
        const smartWallet = newSmartWallet(nft);
        console.log("personal wallet", address);
        await smartWallet.connect({
          personalWallet: wallet,
        });
        setSigner(await smartWallet.getSigner());
        console.log("signer", signer);
        setSmartWalletAddress(await smartWallet.getAddress());
        console.log("smart wallet address", await smartWallet.getAddress());
        return smartWallet;
      } else {
        console.log(
          smartWalletAddress,
          "smart wallet not created",
          nft,
          address,
          wallet
        );
      }
    };
    createSmartWallet(nft);
  }, [nft, smartWalletAddress, address, wallet, signer]);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.image}
            />
          </div>
          <div className={styles.listingContainer}>
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  src={contractMetadata.image}
                  className={styles.collectionImage}
                />
                <p className={styles.collectionName}>{contractMetadata.name}</p>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
            {smartWalletAddress ? (
              <SmartWalletConnected signer={signer} />
            ) : (
              <div className={styles.btnContainer}>
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params && params.tokenId) {
    const tokenId = params.tokenId as string;
    const sdk = new ThirdwebSDK(activeChain);
    const contract = await sdk.getContract(NFTDROP_ADDRESS);
    const nft = await contract.erc721.get(tokenId);

    let contractMetadata;

    try {
      contractMetadata = await contract.metadata.get();
    } catch (e) {}

    return {
      props: {
        nft,
        contractMetadata: contractMetadata || null,
      },
      revalidate: 1,
    };
  }

  return {
    props: {
      error: true,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const sdk = new ThirdwebSDK(activeChain);

  const contract = await sdk.getContract(NFTDROP_ADDRESS);

  const nfts = await contract.erc721.getAll();

  const paths = nfts.map((nft) => ({
    params: {
      contractAddress: NFTDROP_ADDRESS,
      tokenId: nft.metadata.id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};
