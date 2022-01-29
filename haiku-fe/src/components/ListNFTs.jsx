import React, { useEffect, useState } from "react";
import { useContract, useProvider } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";
import NFTCard from "./NFTCard";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";
import "./ListNFTs.css";

const ListNFTs = ({ userAddress, signer }) => {
  const ABI = abi.abi;

  const [nfts, setNfts] = useState([]);
  const provider = useProvider();

  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: signer,
  });

  const getNfts = async () => {
    const moralisBase = "https://deep-index.moralis.io/api/v2/";
    const url = moralisBase.concat(
      userAddress,
      "/nft/",
      CONTRACT_ADDRESS,
      "?chain=mumbai&format=decimal"
    );
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key":
          "krykhc3xNHLWfWCyXCRLox7OjUnt8Mmh0uOY33A8sFyXj7qgppaddzMG5HepfLgk",
      },
    });
    const json = await res.json();
    const results = json["result"];
    Promise.all(results.map((res) => getNftData(res))).then((nfts) => {
      setNfts(nfts);
    });
  };

  const decodeBase64 = (thing) => {
    const indexOfComma = thing.indexOf(",");
    const data = thing.substring(indexOfComma + 1);
    const decoded = atob(data);
    return decoded;
  };

  const getHaikuLines = (imageData) => {
    const imageSvg = decodeBase64(imageData);
    const re = new RegExp('\\">(.*?)</tspan>', "g");
    const matches = [...imageSvg.matchAll(re)];
    const lines = matches.map((group) => group[1]); // the second element is the text
    return lines;
  };

  const getNftData = async (res) => {
    let tokenUri = res.tokenUri;
    if (res.syncing > 0) {
      tokenUri = await contract.tokenURI(res.token_id);
    }

    const decodedNftData = JSON.parse(decodeBase64(tokenUri));
    const haikuLines = getHaikuLines(decodedNftData.image);

    return {
      tokenId: res.token_id,
      lines: haikuLines,
      ...decodedNftData,
    };
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && signer !== null) {
      getNfts();
    }
    if (provider) {
      provider.pollingInterval = 600000; // 6 minutes
      contract.on("HaikuUpdated", getNfts);
    }

    return () => {
      if (contract) {
        contract.off("HaikuUpdated", getNfts);
      }
    };
  }, [signer]);

  return (
    <>
      <h1 className="list-nfts-title">My Haikus</h1>
      {nfts.map((nft) => {
        return (
          <div key={nft.tokenId} className="nfts-container">
            <NFTCard nftData={nft} signer={signer} />
          </div>
        );
      })}
    </>
  );
};

export default ListNFTs;
