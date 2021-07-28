export {};

// Retrieve environment variables
require("dotenv").config();

import Web3 from "web3";
import path from "path";
import fs from "fs";

const PRIVATE_KEY = process.env.PRIVATE_KEY || null;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || null;

const marketplaceAbi = JSON.parse(
  fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../smart_contracts/build/contracts/Marketplace.json"
      )
    )
    .toString()
).abi;

function initialize() {
  if (PRIVATE_KEY == null) {
    console.error("⚠ Private key is empty! Application will quit now.");
    process.exit();
  }
  const web3 = new Web3("ws://127.0.0.1:7545");
  const marketplace = new web3.eth.Contract(marketplaceAbi, CONTRACT_ADDRESS!);
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

  return { web3, account, marketplace };
}

export { initialize };
