const FortyTwoKLToken = artifacts.require("FortyTwoKLToken");
const Marketplace = artifacts.require("Marketplace");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const utils = require("./helpers/utils");

contract("Marketplace", (accounts) => {
  let instance;
  let token;
  const [alice, bob, chad] = accounts;

  const amount = new BN(1000).mul(utils.multiplier);
  const evalPoints = new BN(2);
  const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));
  const secondPurchase = new BN(3);
  const secondPurchasePaid = secondPurchase.mul(
    new BN(50).mul(utils.multiplier)
  );
  const thirdPurchase = new BN(3);
  const thirdPurchasePaid = thirdPurchase.mul(new BN(50).mul(utils.multiplier));
  const ADMIN_ROLE = web3.utils.keccak256("ADMIN_ROLE");

  let purchaseId;
  let secondPurchaseId;
  let thirdPurchaseId;

  beforeEach(async () => {
    token = await FortyTwoKLToken.new();
    instance = await Marketplace.new(token.address);

    await token.mint(alice, amount, {
      from: alice,
    });

    await instance.grantRole(ADMIN_ROLE, bob, { from: alice });

    const conversionRate = new BN(50).mul(utils.multiplier);
    await instance.setConversionRate(conversionRate, {
      from: alice,
    });

    await token.approve(instance.address, amountPaid, { from: alice });
    const result = await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });
    purchaseId = result.logs[0].args.id;
  });

  it("should allow alice to withdraw from contract", async () => {
    await instance.purchaseSuccess(purchaseId, { from: alice });

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

  it("should should not allow alice to withdraw from contract as funds are locked", async () => {
    await expectRevert.unspecified(
      instance.withdrawTokens(alice, amountPaid, {
        from: alice,
      })
    );
  });

  it("should allow alice to withdraw only unlocked funds", async () => {
    let oldBalance;
    let newBalance;
    let currentBalance;
    let result;
    let withdrawReceipt;

    // Alice purchase again
    await token.approve(instance.address, secondPurchasePaid, { from: alice });
    result = await instance.purchaseEvalPoints(secondPurchase, {
      from: alice,
    });
    secondPurchaseId = result.logs[0].args.id;

    // Success first
    await instance.purchaseSuccess(purchaseId, { from: alice });

    oldBalance = await token.balanceOf(alice);
    newBalance = oldBalance.add(amountPaid);

    // Withdraw first
    withdrawReceipt = await instance.withdrawTokens(alice, amountPaid, {
      from: alice,
    });

    expectEvent(withdrawReceipt, "WithdrawTokensEvent", {
      recipient: alice,
      amount: amountPaid,
    });

    currentBalance = await token.balanceOf(alice);

    // Check new balance
    assert.equal(
      newBalance.toString(10),
      currentBalance.toString(10),
      "Balance not equal!"
    );

    // Alice purchase again
    await token.approve(instance.address, thirdPurchasePaid, { from: alice });
    result = await instance.purchaseEvalPoints(thirdPurchase, {
      from: alice,
    });
    thirdPurchaseId = result.logs[0].args.id;

    oldBalance = await token.balanceOf(alice);

    // Fail second, which auto withdraws
    await instance.purchaseFail(secondPurchaseId, { from: bob });

    newBalance = oldBalance.add(secondPurchasePaid);

    currentBalance = await token.balanceOf(alice);

    // Check new balance
    assert.equal(
      newBalance.toString(10),
      currentBalance.toString(10),
      "Balance not equal!"
    );

    // Contract should still have third, alice has 1000 - third
    const contractBalance = await token.balanceOf(instance.address);
    assert.equal(
      contractBalance.toString(10),
      thirdPurchasePaid.toString(10),
      "Contract balance not equal!"
    );
  });

  it("should not allow alice to withdraw from contract to chad", async () => {
    await expectRevert.unspecified(
      instance.withdrawTokens(chad, amountPaid, {
        from: alice,
      })
    );
  });

  it("should not allow chad to withdraw from contract", async () => {
    await expectRevert.unspecified(
      instance.withdrawTokens(alice, amountPaid, {
        from: chad,
      })
    );
  });
});
