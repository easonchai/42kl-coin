// Retrieve environment variables
require("dotenv").config();

const Web3 = require("web3");
const BN = require("bn.js");
const axios = require("axios");
const PRIVATE_KEY = process.env.PRIVATE_KEY || null;

function init() {
  console.log("📡 Initializing backend...");
}

init();
