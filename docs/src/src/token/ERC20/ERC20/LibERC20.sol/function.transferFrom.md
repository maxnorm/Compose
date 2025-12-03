# transferFrom
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Transfers tokens from one address to another using an allowance.

Deducts the spender's allowance and updates balances.


```solidity
function transferFrom(address _from, address _to, uint256 _value) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to send tokens from.|
|`_to`|`address`|The address to send tokens to.|
|`_value`|`uint256`|The number of tokens to transfer.|


