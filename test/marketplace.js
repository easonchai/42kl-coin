const FortyTwoKLCoin = artifacts.require("FortyTwoKLCoin");
const Marketplace = artifacts.require("Marketplace");
const utils = require("./helpers/utils");

contract("FortyTwoKLCoin", (accounts) => {
  let instance;
  let token;
  const [alice, bob, chad] = accounts;

  const ADMIN_ROLE = web3.utils.keccak256("ADMIN_ROLE");
  const DEFAULT_ADMIN_ROLE = web3.utils.keccak256("DEFAULT_ADMIN_ROLE");

  beforeEach(async () => {
    token = await FortyTwoKLCoin.new();
    instance = await Marketplace.new(token.address);

    await token.mint(alice, 1000, { from: alice });
  });

  it("should show alice as DEFAULT_ADMIN_ROLE", async () => {
    const result = await instance.hasRole(DEFAULT_ADMIN_ROLE, alice);
    assert.equal(result, true, "Not DEFAULT_ADMIN_ROLE!");
  });

  it("should show alice as ADMIN_ROLE", async () => {
    const result = await instance.hasRole(ADMIN_ROLE, alice);
    assert.equal(result, true, "Not ADMIN_ROLE!");
  });

  it("should show alice's balance via Marketplace", async () => {
    const balance = await instance.token.balanceOf(alice);
    assert.equal(balance, 1000, "Balance is not equal 1000!");
  });
});
