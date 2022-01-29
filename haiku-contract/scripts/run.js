// Main function when we fund the contract.
const main = async () => {
  const [
    owner,
    randomPerson,
  ] = await hre.ethers.getSigners();

  const nftContractFactory = await hre.ethers.getContractFactory('Haiku');
  const nftContract = await nftContractFactory.deploy(10);
  await nftContract.deployed();
  console.log("Contract deployed to: %s", nftContract.address);

  getAndPrintBalance(randomPerson, 'Random Person 1');

  let txn = await nftContract.connect(randomPerson).mint();
  await txn.wait();

  txn = await nftContract.mint();
  await txn.wait();

  txn = await nftContract.updatePoem(1, "#000", "#fff");
  await txn.wait();

  txn = await nftContract.connect(randomPerson).updatePoem(0, "#000", "#fff");
  await txn.wait();

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const getAndPrintBalance = async (person, name) => {
  let balance = await person.getBalance();
  console.log(
    `${name} balance:`,
    hre.ethers.utils.formatEther(balance)
  );
}

runMain();