import Axios from "axios";

const BASE_API_URL = process.env.VUE_APP_BASE_URL || "http://localhost:3000/";

const instance = Axios.create({
  baseURL: BASE_API_URL,
  timeout: 3000,
});

export const axios = instance;
