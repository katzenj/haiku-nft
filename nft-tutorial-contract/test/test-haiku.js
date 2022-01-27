const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Poem", function () {
  let contract;

  beforeEach(async function() {
    const Poem = await ethers.getContractFactory("Haiku");
    contract = await Poem.deploy(10);
    await contract.deployed();
  });

  it("only allows poem edits by owner", async function () {
    const [owner, _random] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();

    let update = contract.connect(_random).updatePoem(0, "white", "black");
    await expect(update).to.be.reverted;

    update = await contract.connect(owner).updatePoem(0, "white", "black");
    await txn.wait();
  });

  it("only allows valid haiku updates", async function () {
    // const [owner, _random] = await ethers.getSigners();

    // const txn = await contract.mint();
    // await txn.wait();

    // let update = contract.updatePoem(0, ["one really really really really really long line", "two", "three"]);
    // await expect(update).to.be.reverted;

    // update = await contract.updatePoem(0, ["life's little, our heads", "sad. redeemed and wasting clay", "this chance. be of use"]);
    // await txn.wait();
  });

  it("can edit poem", async function () {
    const [owner] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();

    const update = await contract.updatePoem(0, "white", "#fff");
    await txn.wait();
  });

  it("emits events", async function () {
    // const [owner] = await ethers.getSigners();
    // const tokenId = 0;
    // const txn = await contract.mint();

    // let receipt = await txn.wait();
    // expect(receipt.events.length).to.equal(2); // Transfer & Mint
    // let eventArgs = receipt.events[1].args; // Mint
    // expect(eventArgs.to).to.equal(owner.address);
    // expect(eventArgs.tokenId).to.equal(tokenId);

    // const update = await contract.updatePoem(tokenId, ["one", "two", "three"]);
    // receipt = await update.wait();
    // expect(receipt.events.length).to.equal(1)
    // eventArgs = receipt.events[0].args;
    // expect(eventArgs.owner).to.equal(owner.address);
    // expect(eventArgs.tokenId).to.equal(tokenId);
  });
});
