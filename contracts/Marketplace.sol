// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Marketplace for 42KL Coin
/// @author Eason Chai
/// @dev This is where we can convert 42KL coin to eval points, etc.
contract Marketplace is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  uint public conversionRate;
  address ftklCoinAddress;
  
  // Events
  event SetConversionRateEvent(address updatedBy, uint conversionRate);

  constructor(address _coinAddress) {
    ftklCoinAddress = _coinAddress;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  /// @notice Set conversion rate
  /// @dev 1 evaluation point = conversionRate [42KL coin]
  /// @param _conversionRate The conversion rate used to buy 1 eval point
  function setConversionRate(uint _conversionRate) public onlyRole(ADMIN_ROLE) {
    conversionRate = _conversionRate;
    emit SetConversionRateEvent(msg.sender, _conversionRate);
  }

  /// @notice Purchase evaluation points
  /// @dev Converts 42KL coin to evaluation points based on conversionRate
  function purchaseEvalPoints(uint evalPoints) external {
    
  }
}
