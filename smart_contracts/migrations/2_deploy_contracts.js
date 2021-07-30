const FortyTwoKLToken = artifacts.require("FortyTwoKLToken");
const Marketplace = artifacts.require("Marketplace");
const { BN } = require("@openzeppelin/test-helpers");

const multiplier = new BN(10, 10).pow(new BN(18, 10));

module.exports = async function (deployer, network, accounts) {
  // Deploy token
  await deployer.deploy(FortyTwoKLToken);
  const token = await FortyTwoKLToken.deployed();

  // Pass token into Marketplace
  await deployer.deploy(Marketplace, token.address);
  const marketplace = await Marketplace.deployed();

  const price = new BN(50).mul(multiplier);
  marketplace.setConversionRate(price, { from: accounts[0] });

  if (network == "development") {
    const amount = new BN(1000, 10);
    const total = amount.mul(multiplier);

    await token.mint(accounts[0], total, {
      from: accounts[0],
    });
  }
};
