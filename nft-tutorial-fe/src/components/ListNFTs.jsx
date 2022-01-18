import React, { useEffect, useState } from "react";
import { useContract, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";
import UpdateNFT from "./UpdateNFT";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";
import "./ListNFTs.css";

const ListNFTs = ({ userAddress, signer, selectedNft, setSelectedNft }) => {
  const ABI = abi.abi;

  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState([]);

  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: signer,
  });

  const getImage = (encodedJson) => {
    const index = encodedJson.indexOf(",");
    const substr = encodedJson.substring(index + 1);
    const decoded = atob(substr);
    const image = JSON.parse(decoded)["image"];
    return image;
  };

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
    Promise.all(results.map((res) => getNftData(res))).then((nfts) =>
      setNfts(nfts)
    );
  };

  const getNftData = async (res) => {
    let tokenUri = res.tokenUri;
    if (res.syncing > 0) {
      tokenUri = await contract.tokenURI(res.token_id);
    }

    return {
      tokenId: res.token_id,
      tokenUri: tokenUri,
      image: getImage(tokenUri),
    };
  };

  const selectNft = (tokenId) => {
    setSelectedNft(nfts[tokenId]);
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && signer !== null) {
      // getNfts();
      setNfts([
        {
          tokenId: "0",
          tokenUri:
            "data:application/json;base64,eyJuYW1lIjogIkhhaWt1ICMwIiwgImRlc2NyaXB0aW9uIjogIllvdXIgaGFpa3UiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBuYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNuSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUozaE5hVzVaVFdsdUlHMWxaWFFuSUhacFpYZENiM2c5SnpBZ01DQXpOVEFnTXpVd0p6NDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURJMGNIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNjeE1EQWxKeUJvWldsbmFIUTlKekV3TUNVbklHWnBiR3c5SnlNMU5UZzBPV1luSUM4K1BIUmxlSFFnZUQwbk5UQWxKeUI1UFNjeU5TVW5JR05zWVhOelBTZGlZWE5sSnlCa2IyMXBibUZ1ZEMxaVlYTmxiR2x1WlQwbmJXbGtaR3hsSnlCMFpYaDBMV0Z1WTJodmNqMG5iV2xrWkd4bEp6NDhkSE53WVc0Z2VEMGlOVEFsSWlCa2VUMGlNR1Z0SWo1MFpYTjBQQzkwYzNCaGJqNDhkSE53WVc0Z2VEMGlOVEFsSWlCa2VUMGlNUzR4WlcwaVBuVndaR0YwWlR3dmRITndZVzQrUEhSemNHRnVJSGc5SWpVd0pTSWdaSGs5SWpFdU1XVnRJajV1Wm5ROEwzUnpjR0Z1UGp3dmRHVjRkRDQ4TDNOMlp6ND0ifQ==",
          image:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaW5ZTWluIG1lZXQnIHZpZXdCb3g9JzAgMCAzNTAgMzUwJz48c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDI0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyM1NTg0OWYnIC8+PHRleHQgeD0nNTAlJyB5PScyNSUnIGNsYXNzPSdiYXNlJyBkb21pbmFudC1iYXNlbGluZT0nbWlkZGxlJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz48dHNwYW4geD0iNTAlIiBkeT0iMGVtIj50ZXN0PC90c3Bhbj48dHNwYW4geD0iNTAlIiBkeT0iMS4xZW0iPnVwZGF0ZTwvdHNwYW4+PHRzcGFuIHg9IjUwJSIgZHk9IjEuMWVtIj5uZnQ8L3RzcGFuPjwvdGV4dD48L3N2Zz4=",
        },
      ]);
    }
  }, [signer]);

  return (
    <>
      {nfts.map((nft) => {
        return (
          <div key={nft.tokenId} className="nfts-container">
            <button
              onClick={() => selectNft(nft.tokenId)}
              className="image-button"
            >
              <img src={`${nft.image}`} />
            </button>
          </div>
        );
      })}
    </>
  );
};

export default ListNFTs;
