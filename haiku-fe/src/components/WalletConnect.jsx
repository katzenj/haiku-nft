import React from "react";
import Button from "./Button";

import "./WalletConnect.css";

const WalletConnect = ({ accountData, connectData, connectError, connect }) => {
  const validConnectors = connectData.connectors.filter((c) => c.ready);
  return (
    <div className="connect-wallet-container">
      {!accountData &&
        validConnectors.map((connector) => (
          <Button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect(connector)}
          >
            {connector.name}
          </Button>
        ))}
      {connectError && console.error(connectError?.message)}
    </div>
  );
};

export default WalletConnect;
