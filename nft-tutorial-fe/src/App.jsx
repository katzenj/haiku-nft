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
import MintNFT from "./components/MintNFT";
import UpdateNFT from "./components/UpdateNFT";
import Header from "./components/Header";
import WalletConnect from "./components/WalletConnect";

import { CONTRACT_ADDRESS, CHAIN_ID } from "./utils/constants";

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

  return (
    <div>
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
          {accountData && !signerLoading ? (
            <>
              <UpdateNFT signer={signer} />
              <MintNFT signer={signer} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
