import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "../index";
import { axios } from "@/utils/axios";
import { SetLoginBody } from "@/models/profile";

@Module({
  namespaced: true,
  dynamic: true,
  name: "profile",
  store,
})
class Profile extends VuexModule {
  login: string | null = null;
  address = "";

  @Mutation
  setLogin(value: string) {
    this.login = value;
  }

  @Mutation
  setAddress(value: string) {
    this.address = value;
  }

  @Action
  async getLoginId(address: string) {
    let res;
    try {
      res = await axios.get("profiles/" + address);
      this.context.commit("setLogin", res.data);
      this.context.commit("setAddress", address);
    } catch (error) {
      console.log("Error making request to backend");
    }
  }

  @Action
  async setLoginId(body: SetLoginBody) {
    const { address, login } = body;
    try {
      await axios.post("profiles/", {
        address,
        login,
      });
    } catch (error) {
      console.log("Error making request to backend");
    }
    this.context.commit("setAddress", address);
    this.context.commit("setLogin", login);
  }
}

export default getModule(Profile);
