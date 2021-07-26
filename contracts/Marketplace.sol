// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IFortyTwoKLCoin.sol";

/// @title Marketplace for 42KL Token
/// @author Eason Chai
/// @dev This is where we can convert 42KL token to eval points, etc.
contract Marketplace is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  uint public conversionRate;

  IERC20 public token;
  
  // Events
  event SetTokenEvent(address tokenAddress);
  event SetConversionRateEvent(address updatedBy, uint conversionRate);
  event PurchaseEvalPointsEvent(address buyer, uint evalPoints, uint amountPaid);
  event WithdrawTokensEvent(address recipient, uint amount);

  constructor(IERC20 _token) {
    token = _token;
    emit SetTokenEvent(address(_token));
    
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  /// @notice Set conversion rate
  /// @dev 1 evaluation point = conversionRate [42KL token]
  /// @param _conversionRate The conversion rate used to buy 1 eval point
  function setConversionRate(uint _conversionRate) public onlyRole(ADMIN_ROLE) {
    conversionRate = _conversionRate;
    emit SetConversionRateEvent(msg.sender, _conversionRate);
  }

  /// @notice Purchase evaluation points
  /// @dev Converts 42KL token to evaluation points based on conversionRate
  /// @param evalPoints The number of eval points to purchase
  function purchaseEvalPoints(uint evalPoints) external {
    uint amountToPay = evalPoints * conversionRate;
    uint balanceBeforeTransfer = token.balanceOf(address(this));

    require(token.balanceOf(msg.sender) >= amountToPay, "Buyer does not have enough funds!");
    token.transferFrom(msg.sender, address(this), amountToPay);

    assert((balanceBeforeTransfer + amountToPay) == token.balanceOf(address(this)));
    emit PurchaseEvalPointsEvent(msg.sender, evalPoints, amountToPay);
  }

  // Add refund callback if something goes wrong

  /// @notice Withdraw 42KL token
  /// @dev Withdraws to only addresses with ADMIN_ROLE
  /// @param recipient The recipient to receive the tokens
  /// @param amount The amount to withdraw
  function withdrawTokens(address recipient, uint amount) external onlyRole(ADMIN_ROLE) {
    require(hasRole(ADMIN_ROLE, recipient), "Withdrawal address must be an admin!");
    require(token.balanceOf(address(this)) >= amount, "Insufficient balance!");
    token.transfer(recipient, amount);
    emit WithdrawTokensEvent(recipient, amount);
  }

  // Deposit eth

  // Withdraw eth
}
