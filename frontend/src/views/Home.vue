<template>
  <div class="home">
    <button class="web3-address" @click="connect">
      {{ address == "" ? "Connect Wallet" : address }}
    </button>
    <img alt="42 logo" src="../assets/logo.webp" class="logo" />
    <h1 class="title">Evaluation Point Marketplace</h1>
    <div class="purchase-container">
      <input type="number" class="purchase-amount" min="0" v-model="amount" />
      <button
        class="purchase-button"
        @click="purchaseEvalPoints"
        :disabled="address == ''"
      >
        Purchase
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { web3Stores } from "../store/web3";

@Component({})
export default class Home extends Vue {
  private store = web3Stores.retrieve;
  private address = "";
  private amount = 0;
  private chainId = 0;
  private chainToast;

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
  async web3Changed() {
    this.chainId = await this.store.web3.eth.getChainId();
    console.log(this.chainId);
  }

  @Watch("chainId")
  chainChanged() {
    // Since now we are testing on ganache, we must ensure they are on the correct chain!
    if (this.chainId != 1337) {
      this.chainToast = Vue.$toast.warning("You are not on Ganache!", {
        message: "You are not on Ganache!",
        duration: 0,
        dismissible: false,
      });
    } else {
      this.chainToast?.dismiss();
    }
  }

  @Watch("store.ethereum")
  checkChain() {
    this.store.ethereum.on("chainChanged", (chainId: string) => {
      this.chainId = parseInt(chainId, 16);
    });
  }

  @Watch("amount")
  amountChanged() {
    let parsedAmount: any = parseInt(this.amount.toString());
    if (Number.isNaN(parsedAmount)) this.amount = 0;
    else if (parsedAmount < 0) this.amount = 0;
    else this.amount = parsedAmount;
  }

  purchaseEvalPoints() {
    console.log(`Purchasing ${this.amount} eval points`);
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fcfcfc;
  position: relative;
  height: 100vh;
  width: 100vw;

  img {
    width: 533px;
  }

  .web3-address {
    position: absolute;
    top: 36px;
    right: 36px;
    width: 256px;
    height: 40px;
    color: #0e5555;
    background: rgba(61, 203, 203, 0.5);
    border-radius: 8px;
    cursor: pointer;
    border: none;
    padding: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title {
    font-weight: bold;
    font-size: 36px;
    line-height: 49px;
    color: #333333;
    margin-bottom: 105px;
  }

  .purchase {
    &-container {
      display: flex;
      flex-direction: row;
    }

    &-amount {
      color: #333333;
      width: 250px;
      height: 40px;
      border: 1px solid #c9c9c9;
      box-sizing: border-box;
      border-radius: 8px;
      margin-right: 16px;
      padding: 12px;
      font-size: 18px;

      &:focus {
        outline: none;
        border: 1px solid #ababab;
      }
    }

    &-button {
      color: white;
      width: 126px;
      height: 40px;
      background: #3dcbcb;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      font-weight: bold;
      font-size: 18px;

      &:active {
        background: #10bdbd;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}
</style>
