export {};

// Retrieve environment variables
require("dotenv").config();

const Axios = require("axios");
const BASE_API_URL =
  process.env.BASE_API_URL || "https://api.intra.42.fr/v2/users/";
const BEARER_TOKEN = process.env.BEARER_TOKEN || "testing";

const instance = Axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
});

export const axios = instance;
