import BN from 'bn.js';
import { Account, HttpProvider } from 'web3-core';
import { axios } from '../utils/axios';
import { initialize } from '../utils/common';
const MAX_RETRIES = 5;

function init() {
  console.log('📡 Initializing backend...');
  const { web3, account, marketplace } = initialize();

  console.log('⚡ Connection established. Backend initialized!');

  // Listen to events
  marketplace.events.PurchaseEvalPointsEvent(async (err: any, event: any) => {
    if (err) {
      console.error('⚠ Error on event', err);
      return;
    }
    await processPurchase(account, marketplace, event);
  });

  process.on('SIGINT', () => {
    console.log('🛑 Terminating gracefully...');
    (web3.currentProvider as HttpProvider).disconnect();
    process.exit();
  });
}

async function processPurchase(account: Account, marketplace: any, event: any) {
  console.log('🧾 Purchase received! Processing...');

  const { buyer, evalPoints, amountPaid, id } = event.returnValues;
  // Idea 1: Map from buyer address to login ID using a json or db
  const login = 'echai'; //getBuyerLoginId()

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

  makeRequest(account, marketplace, id, amount, 1);
}

async function makeRequest(
  account: Account,
  marketplace: any,
  id: any,
  amount: string,
  tries: number,
) {
  if (tries > MAX_RETRIES) {
    // If fail after 5 times, call purchaseFail
    await purchaseFail(account, marketplace, id);
    return;
  }

  console.info(`Attempt #${tries}`);

  setTimeout(async () => {
    try {
      const response = await axios.post(
        'http://ptsv2.com/t/mf71r-1627483833/post',
        null,
        {
          params: {
            reason: 'Earned it',
            amount,
          },
        },
      );

      // If succeed, call purchaseSuccess
      if (response.status == 200) {
        purchaseSuccess(account, marketplace, id);
        return;
      } else {
        console.log('⚠ POST request failed. Reattempting...');
        tries++;
      }
    } catch (error) {
      console.log('Error with POST request: ', error.response.status);
      tries++;
    }
    makeRequest(account, marketplace, id, amount, tries++);
  }, 1000);
}

async function purchaseSuccess(account: Account, marketplace: any, id: string) {
  console.log('✅ Purchase Success!');
  const receipt = await marketplace.methods
    .purchaseSuccess(id)
    .send({ from: account.address });
  if (receipt.status) {
    console.log('💵 Purchase processed.');
  } else {
    console.log(
      '❗ Purchase failed. Notifying admin for manual acknowledgement',
    );
    // Notify admin here
  }
}

async function purchaseFail(account: Account, marketplace: any, id: string) {
  console.log('❌ Purchase Failed! Refunding...');
  const receipt = await marketplace.methods
    .purchaseFail(id)
    .send({ from: account.address });
  if (receipt.status) {
    console.log('💵 Refund complete.');
  } else {
    console.log('❗ Refund failed. Notifying admin for manual refund');
    // Notify admin here
  }
}

export { init };
