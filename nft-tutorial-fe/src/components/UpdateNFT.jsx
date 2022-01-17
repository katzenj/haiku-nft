import React, { useEffect, useState } from "react";
import { useContract, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";
import "./MintNFT.css";

const UpdateNFT = ({ signer }) => {
  const ABI = abi.abi;

  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState([]);

  // const contract = useContract({
  //   addressOrName: CONTRACT_ADDRESS,
  //   contractInterface: ABI,
  //   signerOrProvider: signer,
  // });

  const maybeUpdate = async ({ tokenId }) => {
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const txn = await contract.updatePoem(
        tokenId,
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

  const getNfts = async () => {
    const res = await fetch(
      "https://deep-index.moralis.io/api/v2/0xFF48d93EE8790B3906C4FECb26A08846Ab0e1109/nft/0xE723428534433E3D187E6e04F2f00C747f1A8160?chain=rinkeby&format=decimal",
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key":
            "krykhc3xNHLWfWCyXCRLox7OjUnt8Mmh0uOY33A8sFyXj7qgppaddzMG5HepfLgk",
        },
      }
    );
    const json = await res.json();
    const results = json["result"];
    const tempNfts = results.map((res) => ({
      tokenId: res.token_id,
      metadata: res.metadata,
      image: JSON.parse(res.metadata)["image"],
    }));
    setNfts(tempNfts);
  };

  useEffect(() => {
    getNfts();
  }, []);

  return (
    <>
      {nfts.map((nft) => {
        return (
          <div key={nft.tokenId}>
            <img src={`${nft.image}`} />
            <Button onClick={() => maybeUpdate({ tokenId: nft.tokenId })}>
              {loading ? <div className="loading"></div> : "Update Haiku"}
            </Button>
          </div>
        );
      })}
    </>
  );
};

export default UpdateNFT;
