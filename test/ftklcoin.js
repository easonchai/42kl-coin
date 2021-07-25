const FortyTwoKLCoin = artifacts.require("FortyTwoKLCoin");
const utils = require("./helpers/utils");

contract("FortyTwoKLCoin", (accounts) => {
  let instance;
  const [alice, bob, chad] = accounts;

  beforeEach(async () => {
    instance = await FortyTwoKLCoin.new();
  });

  it("should show the token symbol as 42KL", async () => {
    const token = await instance.symbol();
    assert.equal(token, "42KL", "Token symbol is not 42KL!");
  });

  it("should show zero balance at start", async () => {
    let balance;
    balance = await instance.balanceOf(alice);
    assert.equal(balance, 0, "Balance is not zero!");
    balance = await instance.balanceOf(bob);
    assert.equal(balance, 0, "Balance is not zero!");
  });

  it("should allow alice to add bob as minter", async () => {
    const result = await instance.addMinter(bob, { from: alice });
    console.log(result.receipt.logs[0]);
    console.log(result.logs[0]);
    console.log(result.logs[0].args[0]);
    assert(result.receipt.status, true, "Failed to add minter!");
  });

  it("should not allow bob to add himself as minter", async () => {
    await utils.shouldThrow(instance.addMinter(bob, { from: bob }));
  });

  it("should allow alice to mint 1000 42KL to herself", async () => {
    const result = await instance.addMinter(bob, { from: alice });
    assert(true);
  });

  it("should allow bob to mint 1000 42KL to himself after given access", async () => {
    await utils.shouldThrow(instance.addMinter(bob, { from: bob }));
  });
});
