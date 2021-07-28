const BN = require("bn.js");
const { axios } = require("./utils/axios");
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
    await processPurchase(event);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Terminating gracefully...");
    web3.currentProvider.disconnect();
    process.exit();
  });
}

async function processPurchase(event: any) {
  console.log("🧾 Purchase received! Processing...");

  const { buyer, evalPoints, amountPaid, id } = event.returnValues;
  // Idea 1: Map from buyer address to login ID using a json or db
  const login = "echai"; //getBuyerLoginId()

  // Idea 2: Add new login id parameter in smart contract
  // Get it here lol

  const amount = evalPoints.toString(10);
  const url = `${login}/correction_points/add`;
  console.log(url);

  // Make POST request
  // axios.post(url, null, {
  //   params: {
  //     reason: "Earned it",
  //     amount,
  //   }
  // });

  let tries = 1;
  while (tries <= MAX_RETRIES) {
    console.info(`Attempt #${tries}`);

    console.log(typeof id);

    try {
      const response = await axios.post(
        "http://ptsv2.com/t/mf71r-1627483833/post",
        null,
        {
          params: {
            reason: "Earned it",
            amount,
          },
        }
      );

      // If succeed, call purchaseSuccess
      if (response.status == 200) {
        purchaseSuccess(id);
        return;
      } else {
        console.log("⚠ POST request failed.");
        tries++;
      }
    } catch (e) {
      console.log("Error with POST request: ", e);
      tries++;
    }
  }

  // If fail after 5 times, call purchaseFail
  purchaseFail(id);
}

async function purchaseSuccess(id: string) {
  console.log("✅ Purchase Success!");
  console.log(id);
}

async function purchaseFail(id: string) {
  console.log("❌ Purchase Failed! Refunding...");
  console.log(id);
}

init();
