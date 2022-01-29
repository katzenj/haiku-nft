import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useSigner, useEnsLookup } from "wagmi";
import { ethers } from "ethers";

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

  return (
    <div className="app-container">
      <Header accountData={accountData} disconnect={disconnect} />
      <div className="main-container">
        <div className="data-container">
          <div className="title">A haiku a day...</div>
          <h4>(Mumbai Polygon Testnet Only!)</h4>
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
