export {};

// Retrieve environment variables
require("dotenv").config();

const Web3 = require("web3");
const PRIVATE_KEY = process.env.PRIVATE_KEY || null;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || null;

const path = require("path");
const fs = require("fs");
const marketplaceAbi = JSON.parse(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "../../../smart_contracts/build/contracts/Marketplace.json"
    )
  )
).abi;

function initialize() {
  if (PRIVATE_KEY == null) {
    console.error("Private key is empty! Application will quit now.");
    return null;
  }
  const web3 = new Web3("ws://127.0.0.1:7545");
  console.log("Connection established. Backend initialized!");

  const marketplace = new web3.eth.Contract(marketplaceAbi, CONTRACT_ADDRESS);
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

  return { web3, account, marketplace };
}

module.exports = {
  initialize,
};
