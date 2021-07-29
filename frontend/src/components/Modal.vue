<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h1 class="title">Set Login ID</h1>
          <input type="text" class="login-id" v-model="login" />
          <button
            class="login-button"
            @click="saveLogin"
            :disabled="login == ''"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class Modal extends Vue {
  private login = "";

  @Emit("close")
  saveLogin() {
    return this.login;
  }
}
</script>

<style lang="scss" scoped>
.modal {
  &-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }

  &-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &-container {
    width: 454px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
  }
}

.title {
  font-weight: bold;
  font-size: 24px;
  color: #333333;
  margin-bottom: 24px;
}

.login {
  &-container {
    display: flex;
    flex-direction: row;
  }

  &-id {
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

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
