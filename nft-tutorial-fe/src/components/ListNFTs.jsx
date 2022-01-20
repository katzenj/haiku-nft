import React, { useEffect, useState } from "react";
import { useContract, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";
import UpdateNFT from "./UpdateNFT";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";
import "./ListNFTs.css";

const ListNFTs = ({ userAddress, signer }) => {
  const ABI = abi.abi;

  const [nfts, setNfts] = useState([]);

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

  const getNftData = async (res) => {
    let tokenUri = res.tokenUri;
    if (res.syncing > 0) {
      tokenUri = await contract.tokenURI(res.token_id);
    }

    const indexOfComma = tokenUri.indexOf(",");
    const jsonData = tokenUri.substring(indexOfComma + 1);
    const decoded = JSON.parse(atob(jsonData));

    return {
      tokenId: res.token_id,
      ...decoded,
    };
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && signer !== null) {
      // getNfts();
      setNfts([
        {
          description: "Your haiku",
          image:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaW5ZTWluIG1lZXQnIHZpZXdCb3g9JzAgMCAzNTAgMzUwJz48c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDI0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyM1NTg0OWYnIC8+PHRleHQgeD0nNTAlJyB5PScyNSUnIGNsYXNzPSdiYXNlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz48dHNwYW4geD0iNTAlIiBkeT0iMGVtIj50ZXN0PC90c3Bhbj48dHNwYW4geD0iNTAlIiBkeT0iMS4xZW0iPnVwZGF0ZTwvdHNwYW4+PHRzcGFuIHg9IjUwJSIgZHk9IjEuMWVtIj5uZnQ8L3RzcGFuPjwvdGV4dD48L3N2Zz4=",
          name: "Haiku #0",
          tokenId: "0",
        },

        {
          description: "Your haiku 2",
          image:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaW5ZTWluIG1lZXQnIHZpZXdCb3g9JzAgMCAzNTAgMzUwJz48c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDI0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyM1NTg0OWYnIC8+PHRleHQgeD0nNTAlJyB5PScyNSUnIGNsYXNzPSdiYXNlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz48dHNwYW4geD0iNTAlIiBkeT0iMGVtIj50ZXN0PC90c3Bhbj48dHNwYW4geD0iNTAlIiBkeT0iMS4xZW0iPnVwZGF0ZTwvdHNwYW4+PHRzcGFuIHg9IjUwJSIgZHk9IjEuMWVtIj5uZnQ8L3RzcGFuPjwvdGV4dD48L3N2Zz4=",
          name: "Haiku #2",
          tokenId: "1",
        },
      ]);
    }
  }, [signer]);

  return (
    <>
      {nfts.map((nft) => {
        return (
          <div key={nft.tokenId} className="nfts-container">
            <UpdateNFT nftData={nft} signer={signer} />
          </div>
        );
      })}
    </>
  );
};

export default ListNFTs;
