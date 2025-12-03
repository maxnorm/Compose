# burn
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Burns tokens from a specified address.

Decreases both total supply and the sender's balance.


```solidity
function burn(address _account, uint256 _value) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The address whose tokens will be burned.|
|`_value`|`uint256`|The number of tokens to burn.|


