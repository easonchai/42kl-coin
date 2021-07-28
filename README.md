# 42KL Coin

_Actually a token, but coin sounds cooler anyways_ 😎

## 🚪 Introduction

This is just a fun little project to see what we can do with Ethereum Smart Contracts.

The idea is to allow people to purchase evaluation points (eval points) using the 42KL token.

42KL tokens can be earned by participating in events/activities organized by Bocals.

## 💡 Process

There are two smart contracts in this project:

1. 42KL Token
2. Marketplace

### 💵 42KL Token

The contract is just a basic ERC20 implementation, but implements access control. Tokens can only be minted by addresses with the `MINTER_ROLE`.

### 🛍 Marketplace

The marketplace currently only allows evaluation points to be purchased (not really marketplace like). It also implements access control, so only addresses with `ADMIN_ROLE` can execute 5/6 of the functions, which are withdraw, setting state, and purchase success/fail.

The `purchaseEvalPoints` function is open to all
