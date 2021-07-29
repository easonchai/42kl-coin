<template>
  <div class="home">
    <button v-if="address == ''" class="web3-address" @click="connect">
      Connect Wallet
    </button>
    <button
      v-else
      :class="[login ? '' : 'warning', 'web3-address']"
      @click="setLogin"
    >
      {{ login ? login : "Set Login ID" }}
    </button>
    <img alt="42 logo" src="../assets/logo.webp" class="logo" />
    <h1 class="title">Evaluation Point Marketplace</h1>
    <div class="purchase-container">
      <input type="number" class="purchase-amount" min="0" v-model="amount" />
      <button
        class="purchase-button"
        @click="purchaseEvalPoints"
        :disabled="address == '' || amount <= 0"
      >
        Purchase
      </button>
    </div>
    <Modal @close="saveLogin" v-if="showModal" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { web3Stores } from "../store/web3";
import { profileStores } from "../store/profile";
import { ToastTypes } from "../utils/ToastTypes";
import Modal from "@/components/Modal.vue";
const Marketplace = require("../../../smart_contracts/build/contracts/Marketplace.json");

@Component({
  components: {
    Modal,
  },
})
export default class Home extends Vue {
  private web3Store = web3Stores.retrieve;
  private profileStore = profileStores.retrieve;
  private address = "";
  private amount = 0;
  private chainId = 0;
  private chainToast: any;
  private marketplace: any;
  private login = "default";
  private showModal = false;

  contractAddress = "0x8c145DeF007D580471732d9276Fc73217E69A235";

  async connect() {
    await this.web3Store.connect();
  }

  @Watch("web3Store.ethereum.selectedAddress")
  accountsChange() {
    this.address = this.web3Store.ethereum.selectedAddress;
    this.web3Store.updateAddress(this.web3Store.ethereum.selectedAddress);
    this.profileStore.getLoginId(this.address);
  }

  @Watch("profileStore.login")
  loginChanged() {
    this.login = this.profileStore.login ?? "";
  }

  @Watch("web3Store.web3")
  async web3Changed() {
    // Once web3 exists, we will get chain ID & initialize contract
    this.chainId = await this.web3Store.web3.eth.getChainId();
    this.marketplace = new this.web3Store.web3.eth.Contract(
      Marketplace.abi,
      this.contractAddress
    );

    // Listen for success
    this.marketplace.events.PurchaseSuccessEvent(
      {
        filter: { address: this.address },
        fromBlock: "latest",
      },
      async (error: any, event: any) => {
        if (event) {
          this.openToast(
            "Evaluation Point has been credited!",
            ToastTypes.SUCCESS
          );
        }
      }
    );

    // Listen for fail
    this.marketplace.events.PurchaseFailEvent(
      {
        filter: { address: this.address },
        fromBlock: "latest",
      },
      async (error: any, event: any) => {
        if (event) {
          this.openToast(
            "Evaluation Point purchase fail! Your funds will be refunded.",
            ToastTypes.ERROR
          );
        }
      }
    );
  }

  @Watch("chainId")
  chainChanged() {
    // Since now we are testing on ganache, we must ensure they are on the correct chain!
    if (this.chainId != 1337) {
      this.chainToast = (Vue as any).$toast.warning("You are not on Ganache!", {
        message: "You are not on Ganache!",
        duration: 0,
        dismissible: false,
      });
    } else {
      this.chainToast?.dismiss();
    }
  }

  @Watch("web3Store.ethereum")
  checkChain() {
    this.web3Store.ethereum.on("chainChanged", (chainId: string) => {
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
    this.marketplace.methods
      .purchaseEvalPoints(this.amount)
      .send({ from: this.address }, (error: any, transactionHash: any) => {
        if (error) {
          if (error.code == 4001) {
            this.openToast("Transaction cancelled!", ToastTypes.INFO);
          } else {
            this.openToast("Transaction failed!", ToastTypes.ERROR);
          }
        }
        if (transactionHash) {
          this.openToast("Transaction sent!", ToastTypes.INFO);
        }
      })
      .then((receipt: any) => {
        if (receipt.events.status) {
          this.openToast("Transaction mined!", ToastTypes.INFO);
        }
      });
  }

  openToast(message: string, type: string) {
    (Vue as any).$toast.open({
      message,
      duration: 3000,
      type,
    });
  }

  setLogin() {
    this.showModal = true;
  }

  saveLogin(id: string) {
    this.profileStore.setLoginId({
      address: this.address,
      login: id,
    });
    this.showModal = false;
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

    &.warning {
      background: rgba(237, 172, 7, 0.5);
      color: #9c6300;
    }
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
