const FortyTwoKLCoin = artifacts.require("FortyTwoKLCoin");
const Marketplace = artifacts.require("Marketplace");
const { BN } = require("@openzeppelin/test-helpers");

module.exports = async function (deployer, network, accounts) {
  // Deploy token
  await deployer.deploy(FortyTwoKLCoin);
  const token = await FortyTwoKLCoin.deployed();

  // Pass token into Marketplace
  await deployer.deploy(Marketplace, token.address);

  if (network == "development") {
    const multiplier = new BN(10, 10).pow(new BN(18, 10));
    const amount = new BN(1000, 10);
    const total = amount.mul(multiplier);

    await token.mint(accounts[0], total, {
      from: accounts[0],
    });
  }
};
