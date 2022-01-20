import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useContract } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";

import "./UpdateNFT.css";

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

  console.log(nftData);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card text="dark" style={{ width: "24rem", borderRadius: "10px" }}>
        <Card.Img
          variant="top"
          src={nftData.image}
          style={{ borderRadius: "10px 10px 0px 0px" }}
        />
        <Card.Body>
          <Card.Title>{nftData.name}</Card.Title>
          <Card.Text>{nftData.description}</Card.Text>
          <Button onClick={() => maybeUpdate({ tokenId: nftData.tokenId })}>
            {loading ? <div className="loading"></div> : "Update Haiku"}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateNFT;
