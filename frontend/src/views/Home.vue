<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.webp" />
    <h1>Welcome</h1>
    <h2 v-if="address != ''">{{ address }}</h2>
    <button v-else class="connect" @click="connect">Connect Wallet</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { web3Stores } from "../store/web3";

@Component({})
export default class Home extends Vue {
  private store = web3Stores.retrieve;
  private address = "";

  async connect() {
    await this.store.connect();
  }

  @Watch("store.ethereum.selectedAddress")
  accountsChange() {
    console.log(this.store.ethereum.selectedAddress);
    this.address = this.store.ethereum.selectedAddress;
    this.store.updateAddress(this.store.ethereum.selectedAddress);
  }

  @Watch("store.web3")
  web3Changed() {
    console.log(this.store.web3);
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 360px;
  }
}
</style>
