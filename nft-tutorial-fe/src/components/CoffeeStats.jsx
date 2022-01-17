import React from "react";
import { ethers } from "ethers";
import { useContract, useEnsLookup } from "wagmi";

import Button from "./Button";

import { CONTRACT_ADDRESS } from "../utils/constants";
import { getTrimmedAddress } from "../utils/address";

import abi from "../utils/EthCoffee.json";

import "./CoffeeStats.css";

const ABI = abi.abi;

const CoffeeStats = ({ ens, address, provider, resetReceiver }) => {
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: provider,
  });

  // const newMessages = await contract.getMessagesSent(
  //   ethers.utils.getAddress(address)
  // );

  return (
    <div className="coffee-stats-container">
      <div className="receiver-account-container">
        {address ? (
          <>
            {ens?.avatar ? (
              <img src={data.ens?.avatar} alt="ENS Avatar" />
            ) : null}
            <div className="receiver-address-container">
              <b>Receiver: </b>
              {ens?.name ? ens?.name : getTrimmedAddress(address)}
              <button className="cancel-button" onClick={resetReceiver}>
                <i className="far fa-times-circle"></i>
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CoffeeStats;
