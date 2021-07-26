// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IFortyTwoKLCoin.sol";

/// @title Marketplace for 42KL Coin
/// @author Eason Chai
/// @dev This is where we can convert 42KL coin to eval points, etc.
contract Marketplace is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  uint public conversionRate;

  IERC20 public token;
  
  // Events
  event SetTokenEvent(address tokenAddress);
  event SetConversionRateEvent(address updatedBy, uint conversionRate);
  event PurchaseEvalPointsEvent(address buyer, uint evalPoints, uint amountPaid);

  constructor(IERC20 _token) {
    token = _token;
    emit SetTokenEvent(address(_token));
    
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
    uint amountToPay = evalPoints * conversionRate;
    require(token.balanceOf(msg.sender) >= amountToPay, "Buyer does not have enough funds!");
    token.transferFrom(msg.sender, address(this), amountToPay);
    // Add assert here
    emit PurchaseEvalPointsEvent(msg.sender, evalPoints, amountToPay);
  }
}
