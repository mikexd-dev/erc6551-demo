import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import styles from "./NFT.module.css";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  return (
    <>
      <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftImage} />

      <p className={styles.nftTokenId}>Token ID #{nft.metadata.id}</p>
      <p className={styles.nftName}>{nft.metadata.name}</p>
      {nft.quantityOwned && (
        <p className={styles.nftTokenId} style={{ marginTop: "-5px" }}>
          Quantity: {nft.quantityOwned}
        </p>
      )}
    </>
  );
}
