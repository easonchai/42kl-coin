const BN = require("bn.js");
const axios = require("./utils/axios");
const { initialize } = require("./utils/common");
const MAX_RETRIES = 5;

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

  process.on("SIGINT", () => {
    console.log("🛑 Terminating gracefully...");
    web3.currentProvider.disconnect();
    process.exit();
  });
}

async function giveEvalPoints(event: any) {
  console.log("🧾 Purchase received! Processing...");
  const { buyer, evalPoints, amountPaid, id } = event.returnValues;
  // Map from buyer address to login?
  // Add new login id parameter in smart contract
  const url = `${buyer}/correction_points/add`;
  const amount = evalPoints.toString(10);
  console.log(url);
  console.log(amount);

  // Make POST request
  // axios.post(url, null, {
  //   params: {
  //     reason: "Earned it",
  //     amount,
  //   }
  // });

  // If succeed, call purchaseSuccess

  // If fail, retry 5 times, otherwise call purchaseFail
}

async function purchaseFail() {}

init();
