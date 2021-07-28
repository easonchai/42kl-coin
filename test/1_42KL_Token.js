const FortyTwoKLToken = artifacts.require("FortyTwoKLToken");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("FortyTwoKLToken", (accounts) => {
  let instance;
  const [alice, bob, chad] = accounts;

  const MINTER_ROLE = web3.utils.keccak256("MINTER_ROLE");

  beforeEach(async () => {
    instance = await FortyTwoKLToken.new();
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
    const result = await instance.grantRole(MINTER_ROLE, bob, { from: alice });
    assert.equal(result.receipt.status, true, "Failed to add minter!");
  });

  it("should not allow bob to add himself as minter", async () => {
    await expectRevert.unspecified(
      instance.grantRole(MINTER_ROLE, bob, { from: bob })
    );
  });

  it("should not allow bob to mint", async () => {
    await expectRevert.unspecified(instance.mint(alice, 1000, { from: bob }));
    await expectRevert.unspecified(instance.mint(bob, 1000, { from: bob }));
  });

  it("should allow alice to mint 1000 42KL Coin to herself", async () => {
    await instance.mint(alice, 1000, { from: alice });
    const balance = await instance.balanceOf(alice);
    assert.equal(balance, 1000, "Balance is not equal 1000!");
  });

  it("should allow alice to mint 1000 42KL Coin to bob", async () => {
    await instance.mint(bob, 1000, { from: alice });
    const balance = await instance.balanceOf(bob);
    assert.equal(balance, 1000, "Balance is not equal 1000!");
  });

  it("should allow bob to mint 1000 42KL Coin to himself after given access", async () => {
    await instance.grantRole(MINTER_ROLE, bob, { from: alice });
    await instance.mint(bob, 1000, { from: bob });
    const balance = await instance.balanceOf(bob);
    assert.equal(balance, 1000, "Balance is not equal 1000!");
  });

  it("should allow alice to send 500 to chad", async () => {
    await instance.mint(alice, 1000, { from: alice });
    await instance.transfer(chad, 500, { from: alice });
    let balance;
    balance = await instance.balanceOf(alice);
    assert.equal(balance, 500, "Balance is not 500!");
    balance = await instance.balanceOf(chad);
    assert.equal(balance, 500, "Balance is not 500!");
    balance = await instance.balanceOf(bob);
    assert.equal(balance, 0, "Balance is not zero!");
  });
});
