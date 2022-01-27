import React, { useEffect, useState } from "react";
import { useContract, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";
import "./MintNFT.css";

const UpdateNFT = ({ nftData, signer, unsetNft }) => {
  const ABI = abi.abi;

  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState([]);

  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: signer,
  });

  const maybeUpdate = async ({ tokenId }) => {
    try {
      setLoading(true);
      const txn = await contract.updatePoem(
        ethers.BigNumber.from(tokenId),
        ["test", "update", "nft"],
        { gasLimit: 900000 }
      );
      console.log("mining --- ", txn);
      await txn.wait();
      console.log("mined --- ", txn);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && signer !== null) {
      // getNfts();
      console.log(nftData);
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
      <div key={nftData.tokenId}>
        <img src={`${nftData.image}`} />
        <Button onClick={() => maybeUpdate({ tokenId: nftData.tokenId })}>
          {loading ? <div className="loading"></div> : "Update Haiku"}
        </Button>
      </div>
    </>
  );
};

export default UpdateNFT;