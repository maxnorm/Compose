# transfer
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Transfers tokens from the caller to another address.

Updates balances directly without allowance mechanism.


```solidity
function transfer(address _to, uint256 _value) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address to send tokens to.|
|`_value`|`uint256`|The number of tokens to transfer.|


