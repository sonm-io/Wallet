pragma solidity ^0.4.13;

import './StandardToken.sol';

import './Ownable.sol';

contract SNMT is StandardToken, Ownable{

  string public name = "SONM Testnet Token";
  string public symbol = "SNMT";
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 100000 * 1 ether ;

  function SNMT() {
    totalSupply = INITIAL_SUPPLY;
    balances[this] = INITIAL_SUPPLY;
  }

  function mintToken(address target, uint256 mintedAmount) onlyOwner {
      balances[target] += mintedAmount;
      totalSupply += mintedAmount;
      Transfer(0, owner, mintedAmount);
      Transfer(owner, target, mintedAmount);
  }

  // @dev Gives the sender 10000 SNMT's,
  function getTokens() {
    uint256 value = 10000000000000000000000;
    if (balances[this] < value) return;
    require(balances[msg.sender] < 200000);
    balances[this] = balances[this].sub(value);
    balances[msg.sender] = balances[msg.sender].add(value);
  }
}