export {};

// Retrieve environment variables
require("dotenv").config();

const axios = require("axios");
const BASE_API_URL =
  process.env.BASE_API_URL || "https://api.intra.42.fr/v2/users/";
const BEARER_TOKEN = process.env.BASE_API_URL || "testing";

axios.defaults.baseURL = BASE_API_URL;
axios.defaults.headers.common = { Authorization: `Bearer ${BEARER_TOKEN}` };

export default axios;
