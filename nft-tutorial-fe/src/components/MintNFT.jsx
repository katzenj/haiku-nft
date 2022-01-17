import React, { useState } from "react";
import { useContract, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/Haiku.json";
import "./MintNFT.css";

const MintNFT = ({ signer }) => {
  const ABI = abi.abi;

  const [loading, setLoading] = useState(false);

  // const contract = useContract({
  //   addressOrName: CONTRACT_ADDRESS,
  //   contractInterface: ABI,
  //   signerOrProvider: signer,
  // });

  const maybeMint = async () => {
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const txn = await contract.mint();
      console.log("mining --- ", txn);
      await txn.wait();
      console.log("mined --- ", txn);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button onClick={() => maybeMint()}>
      {loading ? <div className="loading"></div> : "Mint Haiku"}
    </Button>
  );
};

export default MintNFT;
