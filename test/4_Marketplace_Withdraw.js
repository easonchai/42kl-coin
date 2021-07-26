const FortyTwoKLToken = artifacts.require("FortyTwoKLToken");
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
    token = await FortyTwoKLToken.new();
    scamToken = await FortyTwoKLToken.new();
    instance = await Marketplace.new(token.address);

    await token.mint(alice, amount, {
      from: alice,
    });
    await scamToken.mint(bob, scamAmount, {
      from: alice,
    });

    const conversionRate = new BN(50).mul(utils.multiplier);

    await instance.setConversionRate(conversionRate, {
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
    const token = new web3.eth.Contract(FortyTwoKLToken.abi, tokenAddress);
    const balance = await token.methods.balanceOf(alice).call();
    assert.equal(balance, amount, "Balance is not equal!");
  });

  it("should allow alice to purchase eval points", async () => {
    const evalPoints = new BN(2);
    const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));
    // Approve first
    await token.approve(instance.address, amountPaid, { from: alice });

    // Then purchase
    const receipt = await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });
    expectEvent(receipt, "PurchaseEvalPointsEvent", {
      buyer: alice,
      evalPoints,
      amountPaid,
    });
  });

  it("should not allow bob to use scam tokens", async () => {
    await utils.shouldThrow(instance.purchaseEvalPoints(2, { from: bob }));
  });

  it("should allow alice to withdraw from contract", async () => {
    const evalPoints = new BN(2);
    const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));
    // Approve first
    await token.approve(instance.address, amountPaid, { from: alice });

    // Then purchase
    await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });

    // Check balance
    const beginningBalance = new BN(1000).mul(utils.multiplier);
    const currentBalance = (await token.balanceOf(alice)).toString(10);
    const expectedBalance = beginningBalance.sub(amountPaid).toString(10);
    assert.equal(currentBalance, expectedBalance, "Balance not equal!");

    // Perform
    const withdrawReceipt = await instance.withdrawTokens(alice, amountPaid, {
      from: alice,
    });

    expectEvent(withdrawReceipt, "WithdrawTokensEvent", {
      recipient: alice,
      amount: amountPaid,
    });

    // Check new balance
    const newBalance = (await token.balanceOf(alice)).toString(10);
    assert.equal(newBalance, amount.toString(10), "Balance not equal!");
  });

  it("should not allow alice to withdraw from contract to chad", async () => {
    const evalPoints = new BN(2);
    const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));

    await token.approve(instance.address, amountPaid, { from: alice });
    await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });
    utils.shouldThrow(
      instance.withdrawTokens(chad, amountPaid, {
        from: alice,
      })
    );
  });

  it("should not allow chad to withdraw from contract", async () => {
    const evalPoints = new BN(2);
    const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));

    await token.approve(instance.address, amountPaid, { from: alice });
    await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });
    utils.shouldThrow(
      instance.withdrawTokens(alice, amountPaid, {
        from: chad,
      })
    );
  });
});
