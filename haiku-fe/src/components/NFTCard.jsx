import React, { useEffect, useState } from "react";
import { useContract } from "wagmi";
import { ethers } from "ethers";
import Card from "react-bootstrap/Card";

import Button from "./Button";
import HaikuEdit from "./HaikuEdit";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";

import "./NFTCard.css";

const NFTCard = ({ nftData, signer, unsetNft }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lineData, setLineData] = useState(nftData.lines ? nftData.lines : []);

  return (
    <div className="card-container">
      <Card text="dark" style={{ width: "100%", borderRadius: "10px" }}>
        <Card.Img
          variant="top"
          src={nftData.image}
          style={{ borderRadius: "10px 10px 0px 0px" }}
        />
        <Card.Body>
          <Card.Title>{nftData.name}</Card.Title>
          <Card.Text>{nftData.description}</Card.Text>
          <HaikuEdit
            signer={signer}
            lines={nftData.lines}
            tokenId={nftData.tokenId}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default NFTCard;
