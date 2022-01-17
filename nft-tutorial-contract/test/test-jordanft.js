const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Poem", function () {
  let contract;

  beforeEach(async function() {
    const Poem = await ethers.getContractFactory("Haiku");
    contract = await Poem.deploy();
    await contract.deployed();
  });

  it("only allows poem edits by owner", async function () {
    const [owner, _random] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();

    let update = contract.connect(_random).updatePoem(0, ["one", "two", "three"]);
    await expect(update).to.be.reverted;

    update = await contract.connect(owner).updatePoem(0, ["one", "two", "three"]);
    await txn.wait();
  });

  it("only allows valid haiku updates", async function () {
    const [owner, _random] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();

    let update = contract.updatePoem(0, ["one really really really really really long line", "two", "three"]);
    await expect(update).to.be.reverted;

    update = await contract.updatePoem(0, ["life's little, our heads", "sad. redeemed and wasting clay", "this chance. be of use"]);
    await txn.wait();
  });

  it("can edit poem", async function () {
    const [owner] = await ethers.getSigners();

    const txn = await contract.mint();
    await txn.wait();

    const update = await contract.updatePoem(0, ["one", "two", "three"]);
    await txn.wait();
  });
});
