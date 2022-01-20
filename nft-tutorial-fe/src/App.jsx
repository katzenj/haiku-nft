import React, { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContract,
  useProvider,
  useSigner,
  useEnsLookup,
} from "wagmi";
import { ethers, providers } from "ethers";

import AddressContainer from "./components/AddressContainer";
import ListNFTs from "./components/ListNFTs";
import MintNFT from "./components/MintNFT";
import Header from "./components/Header";
import WalletConnect from "./components/WalletConnect";

import { CONTRACT_ADDRESS } from "./utils/constants";

import "./App.css";
import abi from "./utils/Haiku.json";

const App = () => {
  const ABI = abi.abi;
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const [
    { data: signer, error: signerError, loading: signerLoading },
    getSigner,
  ] = useSigner();
  const provider = useProvider();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: provider,
  });

  const onUpdate = (owner, timestamp, tokenId) => {
    const thing = {
      owner,
      timestamp: new Date(timestamp * 1000),
      tokenId,
    };
    console.log(thing);
  };

  useEffect(() => {
    let isMounted = true;

    if (provider) {
      provider.pollingInterval = 600000; // 6 minutes
      contract.on("HaikuUpdated", onUpdate);
    }

    return () => {
      if (contract) {
        contract.off("HaikuUpdated", onUpdate);
      }
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-container">
      <Header accountData={accountData} disconnect={disconnect} />
      <div className="main-container">
        <div className="data-container">
          <div className="title">A haiku a day...</div>
          <WalletConnect
            accountData={accountData}
            connectData={connectData}
            connectError={connectError}
            connect={connect}
          />
          {accountData && signer ? (
            <>
              <ListNFTs userAddress={accountData.address} signer={signer} />
              <MintNFT signer={signer} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
