import React from "react";
import ReactDOM from "react-dom";
import { Provider, chain, defaultL2Chains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { ethers, providers } from "ethers";

import "./index.css";
import App from "./App";

import { INFURA_ID, NETWORK, CHAIN_ID, ALCHEMY_KEY } from "./utils/constants";

// Chains for connectors to support
// TODO: change when ready.
const chains = defaultL2Chains.filter((c) => String(c.id) === CHAIN_ID);

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.polygonTestnetMumbai.rpcUrls[0]; // for devnet testing.

  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      options: {
        infuraId: INFURA_ID,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: "Jordan NFT",
        jsonRpcUrl: `${rpcUrl}/${ALCHEMY_KEY}`,
      },
    }),
  ];
};

const provider = ({ chainId }) =>
  // new providers.AlchemyProvider((network = "rinkeby"), ALCHEMY_KEY);
  new providers.InfuraProvider(parseInt(CHAIN_ID), INFURA_ID);

ReactDOM.render(
  <React.StrictMode>
    <Provider autoConnect connectors={connectors} provider={provider}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
