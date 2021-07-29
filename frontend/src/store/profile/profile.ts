import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "../index";

@Module({
  namespaced: true,
  dynamic: true,
  name: "profile",
  store,
})
class Profile extends VuexModule {
  login = "";
  address = "";

  @Mutation
  setLogin(value: string) {
    this.login = value;
  }

  @Mutation
  setAddress(value: string) {
    this.address = value;
  }
}

export default getModule(Profile);
