import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import Web3 from "web3";
import store from "../index";
import { axios } from "@/utils/axios";

@Module({
  namespaced: true,
  dynamic: true,
  name: "web3",
  store,
})
class Web3Instance extends VuexModule {
  web3: Web3 = new Web3();
  address: any = null;
  ethereum: any = null;
  login = "";

  @Mutation
  setWeb3(value: Web3) {
    this.web3 = value;
  }

  @Mutation
  setAddress(value: string) {
    this.address = value;
  }

  @Mutation
  setEthereum(value: any) {
    this.ethereum = value;
  }

  @Mutation
  setLogin(value: string) {
    this.login = value;
  }

  @Action
  async connect() {
    const ethereum = (window as any).ethereum;
    let web3;
    let accounts;

    if (typeof ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      web3 = new Web3(ethereum);
      accounts = await ethereum.request({ method: "eth_requestAccounts" });
    } else {
      console.log("Unable to connect to Metamask, attempt ganache fallback");
      // Ganache fallback
      web3 = new Web3("ws://localhost:7545");
    }

    this.context.commit("setAddress", accounts[0]);
    this.context.commit("setWeb3", web3);
    this.context.commit("setEthereum", ethereum);
  }

  @Action
  async updateAddress(address: string) {
    this.context.commit("setAddress", address);
  }

  @Action
  async getLoginId(address: string) {
    let res;
    try {
      res = await axios.get("profiles/" + address);
      this.context.commit("setLogin", res.data);
    } catch (error) {
      console.log("Error making request to backend");
    }
  }
}

export default getModule(Web3Instance);
