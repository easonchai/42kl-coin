// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title ERC-20 Implementation of 42KL Coin
/// @author Eason Chai
/// @dev Basic ERC-20 Implementation
contract FortyTwoKLCoin is ERC20 {
    constructor() ERC20("42KL Coin", "42KL") {

    }
}
