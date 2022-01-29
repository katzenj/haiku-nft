import React, { useEffect, useState } from "react";
import { useContract } from "wagmi";
import { ethers } from "ethers";

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
      <div className="card">
        <img src={nftData.image} />
        <div className="card-body">
          <h3 className="card-header">{nftData.name}</h3>
          <p>{nftData.description}</p>
          <HaikuEdit
            signer={signer}
            lines={nftData.lines}
            tokenId={nftData.tokenId}
          />
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
