const { BN } = require("@openzeppelin/test-helpers");

async function shouldThrow(promise) {
  try {
    await promise;
    assert(true);
  } catch (err) {
    return;
  }
  assert(false, "The contract did not throw.");
}

const multiplier = new BN(10, 10).pow(new BN(18, 10));

module.exports = {
  shouldThrow,
  multiplier,
};
