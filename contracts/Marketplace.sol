// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title Marketplace for 42KL Token
/// @author Eason Chai
/// @dev This is where we can convert 42KL token to eval points, etc.
contract Marketplace is AccessControl {
  using SafeMath for uint;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  uint public conversionRate;
  IERC20 public token;

  struct Purchase {
    address buyer;
    uint amountPaid;
  }

  mapping(uint=>Purchase) private purchases;
  uint private randNonce = 0;
  uint private lockedTokens = 0;
  
  // Events
  event SetTokenEvent(address tokenAddress);
  event SetConversionRateEvent(address updatedBy, uint conversionRate);
  event PurchaseEvalPointsEvent(address buyer, uint evalPoints, uint amountPaid, uint id);
  event WithdrawTokensEvent(address recipient, uint amount);
  event PurchaseSuccessEvent(address buyer, uint id);
  event PurchaseFailEvent(address buyer, uint refundAmount, uint id);

  constructor(IERC20 _token) {
    token = _token;
    emit SetTokenEvent(address(_token));
    
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  /// @notice Set token instance
  /// @dev In the event the token has to be updated
  /// @param _token The deployed token instance address
  function setToken(IERC20 _token) external onlyRole(ADMIN_ROLE) {
    token = _token;
    emit SetTokenEvent(address(_token));
  }

  /// @notice Set conversion rate (price)
  /// @dev 1 evaluation point = conversionRate
  /// @param _conversionRate The conversion rate used to buy 1 eval point
  function setConversionRate(uint _conversionRate) external onlyRole(ADMIN_ROLE) {
    require(_conversionRate > 0, "MARKETPLACE: Conversion rate cannot be zero!");
    conversionRate = _conversionRate;
    emit SetConversionRateEvent(msg.sender, _conversionRate);
  }

  /// @notice Purchase evaluation points
  /// @dev Converts 42KL token to evaluation points based on conversionRate
  /// @param evalPoints The number of eval points to purchase
  function purchaseEvalPoints(uint evalPoints) external {
    require(evalPoints > 0, "MARKETPLACE: You must purchase at least one eval point!");
    uint amountToPay = evalPoints.mul(conversionRate);

    require(token.balanceOf(msg.sender) >= amountToPay, "MARKETPLACE: Buyer does not have enough funds!");

    uint balanceBeforeTransfer = token.balanceOf(address(this));
    token.transferFrom(msg.sender, address(this), amountToPay);

    // Generate a random ID
    uint id = uint(keccak256(abi.encodePacked(block.timestamp, randNonce, msg.sender, evalPoints, amountToPay)));
    Purchase memory order = Purchase(msg.sender, amountToPay);
    purchases[id] = order;
    lockedTokens = lockedTokens.add(amountToPay);

    assert(amountToPay > 0);
    assert((balanceBeforeTransfer.add(amountToPay)) == token.balanceOf(address(this)));
    emit PurchaseEvalPointsEvent(msg.sender, evalPoints, amountToPay, id);
  }

  /// @notice Removes existing mapping
  /// @dev This is only executed if the backend POST request succeeds
  /// @param id The id of the purchase made earlier
  function purchaseSuccess(uint id) external onlyRole(ADMIN_ROLE) {
    Purchase memory order = purchases[id];

    // Since its impossible, we can assume this is the default, hence it doesn't exist
    require(order.amountPaid > 0, "MARKETPLACE: This order doesn't exist");
    delete purchases[id];
    lockedTokens = lockedTokens.sub(order.amountPaid);
    emit PurchaseSuccessEvent(order.buyer, id);
  }

  /// @notice Refund 42KL token
  /// @dev This is only executed if the backend fails or something went wrong. Also deletes the mapping
  /// @param id The id of the purchase made earlier
  function purchaseFail(uint id) external onlyRole(ADMIN_ROLE) {
    Purchase memory order = purchases[id];

    // Delete it ASAP for security
    delete purchases[id];

    require(order.amountPaid > 0, "MARKETPLACE: This order doesn't exist");
    uint balanceBeforeTransfer = token.balanceOf(address(this));
    require(balanceBeforeTransfer >= order.amountPaid, "MARKETPLACE: Insufficient balance within smart contract!");
    token.transfer(order.buyer, order.amountPaid);

    assert(balanceBeforeTransfer.sub(order.amountPaid) == token.balanceOf(address(this)));
    lockedTokens = lockedTokens.sub(order.amountPaid);
    emit PurchaseFailEvent(order.buyer, order.amountPaid, id);
  }

  /// @notice Withdraw 42KL token
  /// @dev Withdraws to only addresses with ADMIN_ROLE
  /// @param recipient The recipient to receive the tokens
  /// @param amount The amount to withdraw
  function withdrawTokens(address recipient, uint amount) external onlyRole(ADMIN_ROLE) {
    uint withdrawableAmount = token.balanceOf(address(this)).sub(lockedTokens);
    require(hasRole(ADMIN_ROLE, recipient), "MARKETPLACE: Withdrawal address must be an admin!");
    require(withdrawableAmount >= amount, "MARKETPLACE: Withdraw amount exceeds allowed balance!");
    token.transfer(recipient, amount);
    emit WithdrawTokensEvent(recipient, amount);
  }
}
