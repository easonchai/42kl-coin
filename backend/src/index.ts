const BN = require("bn.js");
const axios = require("axios");
const { initialize } = require("./utils/common");

function init() {
  console.log("📡 Initializing backend...");
  const { web3, account } = initialize();

  // Listen to events
}

init();
