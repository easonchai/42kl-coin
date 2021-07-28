const BN = require("bn.js");
const axios = require("axios");
const { initialize } = require("./utils/common");

function init() {
  console.log("📡 Initializing backend...");
  const { web3, account, marketplace } = initialize();

  console.log("⚡ Connection established. Backend initialized!");

  // Listen to events
  marketplace.events.PurchaseEvalPointsEvent(async (err: any, event: any) => {
    if (err) {
      console.error("⚠ Error on event", err);
      return;
    }
    await giveEvalPoints(event);
  });
  // console.log(web3);

  process.on("SIGINT", () => {
    console.log("Terminating gracefully...");
    web3.currentProvider.disconnect();
    process.exit();
  });
}

async function giveEvalPoints(event: any) {
  console.log("Purchase received!");
  console.log(event.returnValues.buyer);
}

init();
