const FortyTwoKLCoin = artifacts.require("FortyTwoKLCoin");
const Marketplace = artifacts.require("Marketplace");
const { BN, expectEvent } = require("@openzeppelin/test-helpers");
const utils = require("./helpers/utils");

contract("Marketplace", (accounts) => {
  let instance;
  let token;
  let scamToken;
  const [alice, bob, chad] = accounts;

  const amount = new BN(1000).mul(utils.multiplier);
  const scamAmount = new BN(2000).mul(utils.multiplier);
  const ADMIN_ROLE = web3.utils.keccak256("ADMIN_ROLE");

  beforeEach(async () => {
    token = await FortyTwoKLCoin.new();
    scamToken = await FortyTwoKLCoin.new();
    instance = await Marketplace.new(token.address);

    await token.mint(alice, amount, {
      from: alice,
    });
    await scamToken.mint(alice, scamAmount, {
      from: alice,
    });
  });

  it("should show alice as ADMIN_ROLE", async () => {
    const result = await instance.hasRole(ADMIN_ROLE, alice);
    assert.equal(result, true, "Not ADMIN_ROLE!");
  });

  it("should set conversion rate at 100 42KL Coin", async () => {
    const conversionRate = new BN(100).mul(utils.multiplier);

    const receipt = await instance.setConversionRate(conversionRate, {
      from: alice,
    });

    expectEvent(receipt, "SetConversionRateEvent", {
      updatedBy: alice,
      conversionRate: conversionRate.toString(10),
    });
  });

  it("should show alice's balance via Marketplace", async () => {
    const tokenAddress = await instance.token();
    const token = new web3.eth.Contract(FortyTwoKLCoin.abi, tokenAddress);
    const balance = await token.methods.balanceOf(alice).call();
    assert.equal(balance, amount, "Balance is not equal!");
  });
});
