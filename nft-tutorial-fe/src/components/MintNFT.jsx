import React, { useState } from "react";
import { useContract, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/JordaNFT.json";
import "./MintNFT.css";

const MintNFT = ({ signer }) => {
  const ABI = abi.abi;

  const [loading, setLoading] = useState(false);

  const [
    { data: signData, error: signError, loading: signLoading },
    signMessage,
  ] = useSignMessage();
  // const contract = useContract({
  //   addressOrName: CONTRACT_ADDRESS,
  //   contractInterface: ABI,
  //   signerOrProvider: signer,
  // });

  const maybeMint = async () => {
    try {
      setLoading(true);
      signMessage({ message: "woof" });
      console.log("before");
      console.log(signer);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const txn = await contract.mintJordaNFT();
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
      {loading ? <div className="loading"></div> : "Mint Duck"}
    </Button>
  );
};

export default MintNFT;
