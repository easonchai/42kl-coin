const FortyTwoKLToken = artifacts.require("FortyTwoKLToken");
const Marketplace = artifacts.require("Marketplace");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const utils = require("./helpers/utils");

contract("Marketplace", (accounts) => {
  let instance;
  let token;
  const [alice, bob] = accounts;

  const amount = new BN(1000).mul(utils.multiplier);

  beforeEach(async () => {
    token = await FortyTwoKLToken.new();
    instance = await Marketplace.new(token.address);

    await token.mint(alice, amount, {
      from: alice,
    });

    const conversionRate = new BN(50).mul(utils.multiplier);

    await instance.setConversionRate(conversionRate, {
      from: alice,
    });
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

  it("should not allow bob to purchase as insufficient balance", async () => {
    await expectRevert.unspecified(
      instance.purchaseEvalPoints(2, { from: bob })
    );
  });

  it("should fail to purchase zero eval points", async () => {
    await expectRevert.unspecified(
      instance.purchaseEvalPoints(0, { from: alice })
    );
  });

  it("should execute purchase success", async () => {
    const evalPoints = new BN(2);
    const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));
    // Approve first
    await token.approve(instance.address, amountPaid, { from: alice });

    // Then purchase
    const result = await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });

    const purchaseId = result.logs[0].args.id;
    const receipt = await instance.purchaseSuccess(purchaseId, { from: alice });
    expectEvent(receipt, "PurchaseSuccessEvent", {
      buyer: alice,
      id: purchaseId,
    });
  });

  it("should execute purchase fail", async () => {
    const evalPoints = new BN(2);
    const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));
    // Approve first
    await token.approve(instance.address, amountPaid, { from: alice });

    // Then purchase
    const result = await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });

    const purchaseId = result.logs[0].args.id;
    const receipt = await instance.purchaseFail(purchaseId, { from: alice });
    expectEvent(receipt, "PurchaseFailEvent", {
      buyer: alice,
      refundAmount: amountPaid,
      id: purchaseId,
    });
  });

  it("should not allow anyone else to execute purchase fail", async () => {
    await expectRevert.unspecified(instance.purchaseFail(0, { from: bob }));
  });

  it("should realize that purchase doesnt exist", async () => {
    await expectRevert.unspecified(
      instance.purchaseSuccess(0, { from: alice })
    );
    await expectRevert.unspecified(instance.purchaseFail(0, { from: alice }));
  });

  it("should not be able to execute purchase success/fail twice for same id", async () => {
    const evalPoints = new BN(2);
    const amountPaid = evalPoints.mul(new BN(50).mul(utils.multiplier));
    // Approve first
    await token.approve(instance.address, amountPaid, { from: alice });

    // Then purchase
    const result = await instance.purchaseEvalPoints(evalPoints, {
      from: alice,
    });

    let purchaseId = result.logs[0].args.id;
    await instance.purchaseSuccess(purchaseId, { from: alice });
    await expectRevert.unspecified(
      instance.purchaseSuccess(purchaseId, { from: alice })
    );
    await expectRevert.unspecified(
      instance.purchaseFail(purchaseId, { from: alice })
    );
  });
});
