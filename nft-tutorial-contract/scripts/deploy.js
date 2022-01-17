// New main deploy for funding contract.
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log('Deploying contracts with account: ', deployer.address);
  console.log('Deployer balance: ', accountBalance.toString());

  const nftContractFactory = await hre.ethers.getContractFactory('JordaNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();

  console.log('nft contract address: ', nftContract.address);

  let txn = await nftContract.mintJordaNFT()
  await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();