const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Poem", function () {
  let contract;

  beforeEach(async function() {
    const Poem = await ethers.getContractFactory("Haiku");
    contract = await Poem.deploy(10);
    await contract.deployed();
  });

  it("mints a haiku", async function() {
    const [owner, _random] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();
  });

  it("only allows poem edits by owner", async function () {
    const [owner, _random] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();

    let update = contract.connect(_random).updatePoem(0, "#000", "#fff");
    await expect(update).to.be.reverted;

    update = await contract.connect(owner).updatePoem(0, "#000", "#fff");
    await txn.wait();
  });

  it("only allows valid hex colors", async function () {
    const [owner] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();

    const update = contract.updatePoem(0, "#000000", "white");
    await expect(update).to.be.reverted;
  });

  it("emits events", async function () {
    const [owner] = await ethers.getSigners();
    const tokenId = 0;
    const txn = await contract.mint();

    let receipt = await txn.wait();
    expect(receipt.events.length).to.equal(2); // Transfer & Mint
    let eventArgs = receipt.events[1].args; // Mint
    expect(eventArgs.to).to.equal(owner.address);
    expect(eventArgs.tokenId).to.equal(tokenId);

    const update = await contract.updatePoem(tokenId, "#111", "#222");
    receipt = await update.wait();
    expect(receipt.events.length).to.equal(1)
    eventArgs = receipt.events[0].args;
    expect(eventArgs.owner).to.equal(owner.address);
    expect(eventArgs.tokenId).to.equal(tokenId);
  });
});
