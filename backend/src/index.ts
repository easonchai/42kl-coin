const BN = require("bn.js");
const axios = require("axios");
const { initialize } = require("./utils/common");

function init() {
  console.log("📡 Initializing backend...");
  const { web3, account, marketplace } = initialize();

  // Listen to events
  marketplace.events.PurchaseEvalPointsEvent(async (err: any, event: any) => {
    if (err) {
      console.error("Error on event", err);
      return;
    }
    await giveEvalPoints(event);
  });
}

async function giveEvalPoints(event: any) {
  console.log("received event");
  console.log(event.returnValues.buyer);
}

init();
