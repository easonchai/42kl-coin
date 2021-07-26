// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IFortyTwoKLCoin.sol";

/// @title Marketplace for 42KL Token
/// @author Eason Chai
/// @dev This is where we can convert 42KL token to eval points, etc.
contract Marketplace is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  uint public conversionRate;

  IERC20 public token;
  mapping(address=>uint[]) private purchases;
  uint private randNonce = 0;
  
  // Events
  event SetTokenEvent(address tokenAddress);
  event SetConversionRateEvent(address updatedBy, uint conversionRate);
  event PurchaseEvalPointsEvent(address buyer, uint evalPoints, uint amountPaid, uint id);
  event WithdrawTokensEvent(address recipient, uint amount);
  event RefundTokensEvent(address recipient, uint amount, uint id);

  constructor(IERC20 _token) {
    token = _token;
    emit SetTokenEvent(address(_token));
    
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  /// @notice Set conversion rate
  /// @dev 1 evaluation point = conversionRate [42KL token]
  /// @param _conversionRate The conversion rate used to buy 1 eval point
  function setConversionRate(uint _conversionRate) external onlyRole(ADMIN_ROLE) {
    conversionRate = _conversionRate;
    emit SetConversionRateEvent(msg.sender, _conversionRate);
  }

  /// @notice Purchase evaluation points
  /// @dev Converts 42KL token to evaluation points based on conversionRate
  /// @param evalPoints The number of eval points to purchase
  function purchaseEvalPoints(uint evalPoints) external {
    uint amountToPay = evalPoints * conversionRate;

    require(token.balanceOf(msg.sender) >= amountToPay, "Buyer does not have enough funds!");

    uint balanceBeforeTransfer = token.balanceOf(address(this));
    token.transferFrom(msg.sender, address(this), amountToPay);

    uint id = uint(keccak256(abi.encodePacked(block.timestamp, randNonce, msg.sender, evalPoints, amountToPay)));
    purchases[msg.sender].push(id);

    assert((balanceBeforeTransfer + amountToPay) == token.balanceOf(address(this)));
    emit PurchaseEvalPointsEvent(msg.sender, evalPoints, amountToPay, id);
  }

  /// @notice Refund 42KL token
  /// @dev This is only executed if the backend fails or something went wrong
  /// @param id The id of the purchase made earlier
  function refundTokens(uint id) external onlyRole(ADMIN_ROLE) {

  }

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
