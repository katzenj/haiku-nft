require("dotenv").config();

// require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
// require("solidity-coverage");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.RINKEBY || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS !== undefined,
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    gasPrice: 220,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
