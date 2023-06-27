import { NFT as NFTType } from "@thirdweb-dev/sdk";
import styles from "../../styles/Main.module.css";
import Link from "next/link";
import { NFTDROP_ADDRESS } from "../../const/constants";
import NFT from "./NFT";
import Skeleton from "../Skeleton/Skeleton";
type Props = {
  isLoading: boolean;
  nfts: NFTType[] | undefined;
  emptyText?: string;
};

export default function NFTGrid({ isLoading, nfts, emptyText }: Props) {
  return (
    <div className={styles.nftGridContainer}>
      {isLoading ? (
        [...Array(5)].map((_, index) => (
          <div key={index} className={styles.nftContainer}>
            <Skeleton key={index} width={"100%"} height="312px" />
          </div>
        ))
      ) : nfts && nfts.length > 0 ? (
        nfts.map((nft) => (
          <Link
            href={`/token/${NFTDROP_ADDRESS}/${nft.metadata.id}`}
            key={nft.metadata.id}
            className={styles.nftContainer}
          >
            <NFT nft={nft} />
          </Link>
        ))
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
  );
}
