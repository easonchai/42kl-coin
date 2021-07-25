// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Marketplace for 42KL Coin
/// @author Eason Chai
/// @dev This is where we can convert 42KL coin to eval points, etc.
contract Marketplace {
  address ftklCoinAddress;
  

  constructor(address _coinAddress) {
    ftklCoinAddress = _coinAddress;
  }
  
}