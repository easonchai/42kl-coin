# 42KL Coin

_A smart contract built on Ethereum for trustless & secure purchasing of evaluation points for the 42 Network_

## 🚪 Introduction

This project is split into two parts:

1. The smart contracts `[smart_contracts/]`
1. The backend `[backend/]`

### 📝 Smart Contracts

The explanation for smart contracts can be found within the `smart_contracts` folder.

Essentially, we have a 42KL token which can be used in a marketplace to purchase evaluation points.

### 📡 Backend

The backend listend to events emitted by the smart contract and executes the appropriate request.

### Notes

Some notes to keep in mind:

1. This is far from a secure/proper implementation of smart contracts on Ethereum. Executing a POST request is non-deterministic, hence it should always be avoided. However, this project does not need to worry about this issue as it is not part of its requirements.
