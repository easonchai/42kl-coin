const { BN } = require("@openzeppelin/test-helpers");

const multiplier = new BN(10, 10).pow(new BN(18, 10));

module.exports = {
  multiplier,
};
